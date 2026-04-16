# AI 高并发与防爆架构设计规范 (High Concurrency & Anti-Explosion Architecture)

## 1. 背景与挑战
在大模型 (LLM) 应用中，任何服务商（OpenAI, Gemini, Anthropic）对单个 API Key 都有严格的 Rate Limit（包括 RPM/TPM/RPD）。对于 0Buck 这样面向全球 C 端用户的无头电商平台，完全依赖后端配置的单一 API Key 去扛全量请求，不仅成本高昂，且极易触发 `429 Too Many Requests`，导致全站 AI 服务瘫痪。

## 2. “三位一体”防御策略

为实现 AI 服务的海量并发和高可用，0Buck 采用了以下三级架构：

### 核心层：BYOK (Bring Your Own Key) 与算力转移 🛡️
这是解决大模型并发最彻底的方案。
- **机制**：通过积分 (PTS) 激励，引导用户在前端配置自己的 API Key。
- **并发能力**：当使用 BYOK 时，AI 请求由用户浏览器直接发送至大模型服务商（完全不经过 0Buck 后端）。
- **优势**：
  1. **无限水平扩展**：10 万用户就是 10 万个并发通道，并发上限由大模型服务商决定。
  2. **物理隔离**：用户间限额完全独立，杜绝互相挤占。
  3. **零后端成本**：将最昂贵的算力成本转移到了用户端。

### 平台兜底层：API Key Pool (密钥池化与轮询) 🏦
针对使用平台免费额度的用户，我们采用多 Key 轮询机制打破单 Key 瓶颈。
- **机制**：在 `.env` 或配置表中配置 `GEMINI_API_KEYS`，以逗号分隔传入多个企业级 Key。
- **调度算法**：后端 Agent 每次处理请求时，会将配置的 Key 池进行 `Shuffle` 打乱，实现随机轮询 (Round-Robin)。
- **效果**：如果单 Key 并发为 1000 RPM，池中配置 50 个 Key，则兜底并发能力直接放大至 50,000 RPM。即使其中一个 Key 额度耗尽，系统也会自动切换到下一个。

### 降级与队列层：Graceful Degradation & Queueing 🚦
高并发的最后防线是优雅降级，确保核心链路不断。
- **自动重试 (Exponential Backoff)**：若命中的 Key 触发了 429 限流，Agent 内部会执行指数退避重试（等待 1s -> 2s...），而不是直接抛出异常。
- **模型降级路由 (Fallback)**：若 `gemini-2.5-pro` (高延迟/低并发) 拥堵，Agent 能够自动降级调用 `gemini-2.5-flash` (低延迟/高吞吐)，保障用户能收到回复。
- **异步队列脱水**：对于非实时的重负载任务（如群聊记录分析、用户画像更新），全部推入 Celery/Redis 队列，在低并发时段执行，实现“削峰填谷”。

## 3. 深度架构补丁与未来演进 (Deep Architecture Patches)

基于工业级高并发场景的实际考验，我们在“三位一体”基础之上，引入以下四个深度的架构补丁以保障系统稳健性：

### 3.1 BYOK “安全与信任”补丁
虽然 BYOK 极大地分担了服务器压力，但前端管理的复杂性需要通过以下机制收敛：
*   **前端加密混淆**：用户的 Key 不以明文裸奔，利用浏览器的 Web Crypto API 进行加密存储，防止 XSS 攻击直接拖库。
*   **Key 效能预测 (Tier Check)**：在用户绑定 Key 时，通过空跑极小请求读取 Header 中的限额信息，识别其 RPM/TPM 等级（如免费版 vs 企业版），并在 UI 上直观展示该 Key 的并发承载力。

### 3.2 Key Pool “智能调度”补丁
简单的轮询（Round-Robin）在并发极高时效率低下，需升级为状态感知的路由：
*   **配额感知路由 (Quota-Aware Routing)**：在 Redis 中维护每个 Key 的健康状态。当某个 Key 触发 429 限流时，将其打入“冷却黑名单”（如 60 秒），后续请求直接跳过，避免盲目重试导致的延迟雪崩。
*   **虚拟队列优先级**：根据用户等级（如高 PTS 积分用户、付费会员）分配不同吞吐量的 Key 池，实现核心用户的体验保级。

### 3.3 引入“语义缓存层 (Semantic Cache)” —— 极速降本增效
在社交电商场景中，这是**降维打击级别**的优化策略：
*   **逻辑**：群聊和商品问答中存在大量高频重复问题（如“这件衣服的退换货政策是什么？”、“有没有大一号的？”）。
*   **方案**：在进入 Key Pool 前加一层基于 Redis/向量库的 **GPTCache (语义缓存)**。若 N 分钟内有用户问过相似度 > 95% 的问题，直接返回加密缓存结果。
*   **收益**：**0 Token 消耗，0 毫秒延迟**，能在到达模型前瞬间消灭 20%~30% 的无效并发。

### 3.4 “熔断与脱水”的精细化定义
*   **模型级联降级**：
    *   **Level 1**: 正常请求走高逻辑模型（如 `Gemini 2.5 Pro`）。
    *   **Level 2 (429 频发)**: 自动降级到高速/大限额模型（如 `Gemini 2.5 Flash`）。
    *   **Level 3 (全局过载)**: 进入“脱水模式”，关闭所有视觉理解、多语言翻译等非核心功能，仅保留订单决策和基础检索指令。
*   **任务脱水 (Dehydration)**：
    *   **硬实时**：用户对话、下单支付。必须走主干 Key Pool。
    *   **软实时**：商品描述润色、评论情感分析、长文本摘要。强制进入 Celery 异步队列，仅在 Key Pool 负载低于 30%（如夜间）时启动。

## 4. 代码实现参考

相关逻辑已实现在 `backend/app/services/agent.py` 的 `supervisor` 节点中：

```python
# API Key Pool Logic
raw_pool = config_service.get_api_key("GEMINI_API_KEYS")
api_keys_to_try = [k.strip() for k in raw_pool.split(",") if k.strip()]
random.shuffle(api_keys_to_try) # 打乱顺序，实现简单负载均衡

# 自动重试与降级
for model_name in model_tier:
    for api_key in api_keys_to_try:
        try:
            # 执行调用...
        except Exception as inner_e:
            if "429" in str(inner_e).lower() or "too many requests" in str(inner_e).lower():
                # 指数退避重试
                await asyncio.sleep(2 ** attempt)
                continue
```

## 4. 结论
通过以上设计，0Buck 的 AI 模块不仅是一个聊天机器人，更是一个具备 **成本转移、无限并发扩展、自动容灾降级** 能力的工业级 AI 系统。