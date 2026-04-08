# 0Buck IM 智脑网关 (v5.6) 详细配置指南

本文档提供了将 0Buck 智脑集成到主流即时通讯 (IM) 平台的详细步骤。

---

## 1. 核心 Webhook 端点

所有 IM 消息都通过统一的 API 路由处理。假设您的后端域名为 `https://www.0buck.com`。

| 平台 | Webhook URL | 备注 |
| :--- | :--- | :--- |
| **飞书 (Feishu)** | `https://www.0buck.com/api/v1/im/feishu` | 包含 `url_verification` 握手支持 |
| **Telegram** | `https://www.0buck.com/api/v1/im/telegram` | 需要通过 BotFather 设置 Webhook |
| **WhatsApp** | `https://www.0buck.com/api/v1/im/whatsapp` | Meta 官方 API，支持 `hub.challenge` |
| **Discord** | `https://www.0buck.com/api/v1/im/discord` | 需要开启 Message Content Intent |

---

## 2. 飞书 (Feishu / Lark) 配置

1. **创建应用**：前往 [飞书开放平台](https://open.feishu.cn/) 创建“企业自建应用”。
2. **凭据设置**：
   - 获取 `App ID` 和 `App Secret`。
   - 在 Railway 变量中添加：`FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。
3. **启用机器人**：在应用后台左侧菜单点击“应用功能” -> “机器人”，启用机器人。
4. **事件订阅**：
   - 在“事件订阅”中，设置请求地址为：`https://www.0buck.com/api/v1/im/feishu`。
   - 点击“添加事件”，搜索并添加：`接收消息 v2.0` (im.message.receive_v1)。
5. **权限申请**：
   - 在“权限管理”中，搜索并申请：`读取用户发给机器人的单聊消息`、`读取群组中@机器人的消息`。
   - **重要**：飞书权限变更后必须“发布版本”才能生效。

---

## 3. Telegram 配置

1. **获取 Token**：在 Telegram 中私聊 [@BotFather](https://t.me/botfather)，发送 `/newbot` 创建新机器人并获取 `API Token`。
2. **Railway 变量**：添加 `TELEGRAM_BOT_TOKEN`。
3. **设置 Webhook**：
   使用浏览器访问以下 URL（替换 `<TOKEN>`）：
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://www.0buck.com/api/v1/im/telegram`
4. **验证**：向机器人发送消息，查看是否收到回复。

---

## 4. WhatsApp (Meta Cloud API) 配置

1. **创建 Meta 应用**：在 [Meta for Developers](https://developers.facebook.com/) 创建“商业应用”。
2. **设置 WhatsApp**：点击“添加产品” -> “WhatsApp”。
3. **获取凭据**：
   - 在“API Setup”中获取 `Access Token` 和 `Phone Number ID`。
   - 在 Railway 变量中添加：`WHATSAPP_API_TOKEN` 和 `WHATSAPP_PHONE_NUMBER_ID`。
4. **配置 Webhook**：
   - 验证 Token：设置一个自定义字符串（如 `0buck_verify_token`），并添加到 Railway 变量 `WHATSAPP_VERIFY_TOKEN`。
   - 在 Meta 后台 Webhook 设置中，填入：
     - 回调 URL：`https://www.0buck.com/api/v1/im/whatsapp`
     - 验证 Token：您设置的 `0buck_verify_token`。
   - 订阅 Webhook 事件：选择 `messages`。

---

## 5. Discord 配置

1. **创建应用**：前往 [Discord Developer Portal](https://discord.com/developers/applications)。
2. **Bot 设置**：
   - 创建 Bot 并获取 `Token`。
   - 在 Railway 变量中添加：`DISCORD_BOT_TOKEN`。
   - **关键步骤**：在 Bot 页面下方开启 **"Message Content Intent"**，否则机器人无法读取消息内容。
3. **权限与邀请**：
   - 在 OAuth2 -> URL Generator 中，勾选 `bot` 和 `Administrator` (或特定权限)。
   - 使用生成的链接将机器人邀请入频道。
4. **Webhook 设置**：Discord 消息目前通过 Webhook 接收或 WebSocket 监听（v5.6 采用 Webhook 推送模式）。

---

## 6. 身份桥接 (Identity Bridge) 原理

所有 IM 平台都支持“免登”体验：
- **访客模式**：用户直接给机器人发消息，0Buck 使用 ID 为 1 的公共账户进行回复。
- **绑定流程**：
  1. 机器人会在回复底部附加一个链接：`点击登录获得完整服务`。
  2. 链接包含加密签名 (HMAC-SHA256)，确保安全。
  3. 用户点击后在内置浏览器登录 0Buck，后台自动将用户的 `OpenID` 与 0Buck `Customer ID` 关联。
  4. 关联后，所有对话将具备个性化记忆和订单查询能力。

---

## 7. 诊断、排错与 Railway 设置

### 7.1 实时诊断
访问 `/api/v1/im/test` 可以查看当前环境的凭据加载状态及 AI 智脑连通性：
```json
{
  "version": "v5.6.1-DIAGNOSTIC",
  "status": "ok",
  "ai_brain": {
    "google_api_key_set": true,
    "key_prefix": "AQ.Ab"
  },
  "platforms": {
    "feishu": true,
    "telegram": false,
    "whatsapp": false,
    "discord": false
  }
}
```

### 7.2 Railway 环境变量管理
在 Railway 的 **Variables** 页面中管理以下配置：

| 类别 | 变量名 (Key) | 是否必填 | 说明 |
| :--- | :--- | :--- | :--- |
| **AI 智脑** | `GOOGLE_API_KEY` | 是 | 核心 AI 动力，支持 Gemini 系列模型 |
| **飞书** | `FEISHU_APP_ID` | 是 | 飞书应用 ID |
| **飞书** | `FEISHU_APP_SECRET` | 是 | 飞书应用密钥 |
| **Telegram** | `TELEGRAM_BOT_TOKEN` | 否 | 仅在需要开启 Telegram 机器人时填写 |
| **WhatsApp** | `WHATSAPP_API_TOKEN` | 否 | Meta Cloud API 访问令牌 |
| **WhatsApp** | `WHATSAPP_PHONE_NUMBER_ID` | 否 | Meta 绑定的电话号码 ID |
| **WhatsApp** | `WHATSAPP_VERIFY_TOKEN` | 否 | 默认为 `0buck_verify_token` |
| **Discord** | `DISCORD_BOT_TOKEN` | 否 | Discord 机器人令牌 |

**注意**：
1. **无需重启**：代码已实现热加载，更新 Railway 变量并成功部署后，AI 智脑和 IM 平台状态会自动同步。
2. **AI 模型**：代码已修正模型调用逻辑，确保在 `GOOGLE_API_KEY` 正确的情况下，AI 能够秒回响应。
3. **错误显示**：如果 AI 调用失败，机器人会直接在聊天中反馈具体的错误原因，方便快速定位。
