# IM Gateway Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 以统一网关架构稳定接入 `飞书 + Telegram + WhatsApp + Discord`，复用一套绑定、去重、队列、AI 调用与安全策略。

**Architecture:** 将现有 `app/api/im_gateway.py` 按职责拆分为“网关核心 + 平台适配器 + 绑定服务 + 发送器”。平台适配器仅做协议转换；统一核心负责鉴权、绑定码流程、去重与串行处理。保持现有数据库绑定模型不变，避免双轨身份体系。

**Tech Stack:** FastAPI, SQLAlchemy, httpx, asyncio, Celery(可选), 现有 `run_agent` 与 `UserIMBinding/BindingCode` 模型。

---

### Task 1: 搭建网关核心骨架

**Files:**
- Create: `backend/app/gateway/models.py`
- Create: `backend/app/gateway/core.py`
- Create: `backend/app/gateway/dedup.py`
- Create: `backend/app/gateway/queue.py`
- Modify: `backend/app/api/im_gateway.py`
- Test: `backend/tests/test_im_gateway_core.py`

- [ ] **Step 1: 先写失败测试（标准事件与去重）**

```python
# backend/tests/test_im_gateway_core.py
from app.gateway.models import InboundEvent
from app.gateway.dedup import InMemoryDedupStore

def test_dedup_store_marks_duplicate():
    d = InMemoryDedupStore(max_items=10)
    assert d.seen("feishu:evt1") is False
    assert d.seen("feishu:evt1") is True

def test_inbound_event_shape():
    evt = InboundEvent(
        platform="feishu",
        event_id="e1",
        sender_id="u1",
        chat_id="c1",
        chat_type="p2p",
        text="hello",
    )
    assert evt.platform == "feishu"
    assert evt.text == "hello"
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd backend && pytest tests/test_im_gateway_core.py -q`  
Expected: `ModuleNotFoundError`（尚未实现 `app.gateway`）

- [ ] **Step 3: 实现最小核心代码**

```python
# backend/app/gateway/models.py
from pydantic import BaseModel

class InboundEvent(BaseModel):
    platform: str
    event_id: str
    sender_id: str
    chat_id: str
    chat_type: str
    text: str
```

```python
# backend/app/gateway/dedup.py
class InMemoryDedupStore:
    def __init__(self, max_items: int = 1000):
        self._seen = []
        self._max = max_items

    def seen(self, key: str) -> bool:
        if key in self._seen:
            return True
        self._seen.append(key)
        if len(self._seen) > self._max:
            self._seen = self._seen[-self._max :]
        return False
```

- [ ] **Step 4: 测试转绿**

Run: `cd backend && pytest tests/test_im_gateway_core.py -q`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/gateway/models.py backend/app/gateway/dedup.py backend/tests/test_im_gateway_core.py
git commit -m "feat(im): add gateway core event and dedup primitives"
```

### Task 2: 统一绑定与 Guest/Bound 路由流程

**Files:**
- Create: `backend/app/gateway/binding_service.py`
- Modify: `backend/app/api/im_gateway.py`
- Test: `backend/tests/test_im_gateway_binding_flow.py`

- [ ] **Step 1: 写失败测试（Guest 回复 bind 生成验证码）**

```python
def test_guest_bind_command_generates_code(client):
    payload = {"platform": "telegram", "sender_id": "tg_u_1", "text": "bind"}
    r = client.post("/api/v1/im/simulate", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["mode"] == "guest_bind_code"
    assert len(data["code"]) == 6
```

- [ ] **Step 2: 运行确认失败**

Run: `cd backend && pytest tests/test_im_gateway_binding_flow.py -q`  
Expected: FAIL（接口或服务尚不存在）

- [ ] **Step 3: 实现绑定服务最小闭环**

```python
# backend/app/gateway/binding_service.py
class BindingService:
    async def handle_guest_text(self, platform: str, sender_id: str, text: str):
        # bind -> 生成/复用 6 位验证码
        # 其它 -> 返回引导文案
        ...
```

`im_gateway.py` 中统一调用该服务，不在 webhook 分支里散落绑定逻辑。

- [ ] **Step 4: 运行测试**

Run: `cd backend && pytest tests/test_im_gateway_binding_flow.py -q`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/gateway/binding_service.py backend/app/api/im_gateway.py backend/tests/test_im_gateway_binding_flow.py
git commit -m "feat(im): centralize guest binding flow into binding service"
```

### Task 3: 四平台适配器标准化（Feishu/Telegram/WhatsApp/Discord）

**Files:**
- Create: `backend/app/gateway/platforms/base.py`
- Create: `backend/app/gateway/platforms/feishu.py`
- Create: `backend/app/gateway/platforms/telegram.py`
- Create: `backend/app/gateway/platforms/whatsapp.py`
- Create: `backend/app/gateway/platforms/discord.py`
- Modify: `backend/app/api/im_gateway.py`
- Test: `backend/tests/test_im_gateway_platform_parsers.py`

- [ ] **Step 1: 写失败测试（四平台 payload -> InboundEvent）**

```python
def test_feishu_payload_parsed_to_inbound_event(): ...
def test_telegram_payload_parsed_to_inbound_event(): ...
def test_whatsapp_payload_parsed_to_inbound_event(): ...
def test_discord_payload_parsed_to_inbound_event(): ...
```

- [ ] **Step 2: 运行确认失败**

Run: `cd backend && pytest tests/test_im_gateway_platform_parsers.py -q`  
Expected: FAIL（adapter 不存在）

- [ ] **Step 3: 实现最小 adapter 接口**

```python
# backend/app/gateway/platforms/base.py
from abc import ABC, abstractmethod
from app.gateway.models import InboundEvent

class PlatformAdapter(ABC):
    @abstractmethod
    def parse_inbound(self, payload: dict) -> InboundEvent: ...
```

每个平台实现 `parse_inbound()` 与 `send_text()`，`im_gateway.py` 按 platform 分发。

- [ ] **Step 4: 测试转绿**

Run: `cd backend && pytest tests/test_im_gateway_platform_parsers.py -q`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/gateway/platforms backend/app/api/im_gateway.py backend/tests/test_im_gateway_platform_parsers.py
git commit -m "feat(im): add platform adapters for feishu telegram whatsapp discord"
```

### Task 4: 串行队列 + 统一回执 + 联调回归

**Files:**
- Modify: `backend/app/gateway/core.py`
- Modify: `backend/app/api/im_gateway.py`
- Test: `backend/tests/test_im_gateway_serial_queue.py`
- Test: `backend/tests/test_im_gateway_e2e_smoke.py`

- [ ] **Step 1: 写失败测试（同 chat_id 串行）**

```python
def test_same_chat_events_processed_in_order(): ...
```

- [ ] **Step 2: 运行确认失败**

Run: `cd backend && pytest tests/test_im_gateway_serial_queue.py -q`  
Expected: FAIL（未实现 per-chat queue）

- [ ] **Step 3: 实现队列与统一发送回执**

```python
# core.py
# chat_id -> asyncio.Lock()，同 chat 串行，不同 chat 并行
```

统一回执结构：`thinking -> final`，错误时输出可观测错误码。

- [ ] **Step 4: 跑回归测试**

Run:
- `cd backend && pytest tests/test_im_gateway_serial_queue.py -q`
- `cd backend && pytest tests/test_im_gateway_e2e_smoke.py -q`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/gateway/core.py backend/app/api/im_gateway.py backend/tests/test_im_gateway_serial_queue.py backend/tests/test_im_gateway_e2e_smoke.py
git commit -m "feat(im): add per-chat serial queue and unified delivery pipeline"
```

### Task 5: 文档与运维配置

**Files:**
- Create: `docs/im-gateway-unified.md`
- Modify: `backend/.env.example`
- Test: `backend/scripts/test_im_gateway_guest_does_not_impersonate.py`（补充/更新）

- [ ] **Step 1: 写文档**

文档包含：
- 四平台 webhook 路径
- 平台配置项
- 绑定码流程图
- 安全边界（支付/退款仅引导）
- 故障排查清单

- [ ] **Step 2: 更新配置示例**

在 `.env.example` 增加并说明：
- `FEISHU_*`
- `TELEGRAM_BOT_TOKEN`
- `WHATSAPP_*`
- `DISCORD_BOT_TOKEN`
- `IM_GATEWAY_ENABLE_CELERY`

- [ ] **Step 3: 运行现有安全测试**

Run: `cd backend && pytest scripts/test_im_gateway_guest_does_not_impersonate.py -q`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add docs/im-gateway-unified.md backend/.env.example
git commit -m "docs(im): add unified gateway runbook and env examples"
```

## Plan Self-Review

- Spec coverage: 覆盖了你确认的四平台接入、统一绑定、统一网关、统一安全策略。
- Placeholder scan: 已移除 TBD/TODO；每个任务给了文件、测试、命令与提交点。
- Type consistency: `InboundEvent` 为统一事件模型，后续任务都基于该模型。

