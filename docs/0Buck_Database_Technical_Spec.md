# 0Buck 数据库技术规范 (Database Technical Spec) V1.1

## 1. 核心数据库架构 (Core Architecture)
*   **关系型数据库**：PostgreSQL (RDS)。
*   **向量数据库扩展**：`pgvector`。
*   **并发控制**：Redis。

---

## 2. 核心表结构规范 (Core Table Schemas)

### 2.1 商家主体表 (merchants)
实现"以商为纲"与"物流锚点"的核心。
| 字段名 | 类型 | 说明 |
|:---|:---|:---|
| `id` | SERIAL | 平台唯一商家 ID |
| `supply_merchant_id` | VARCHAR(50) | 1688/阿里原始商家 ID (仅后端可见) |
| `name` | VARCHAR(100) | 脱敏后的商家名 (如：源头基地 #001) |
| `origin_location` | VARCHAR(100) | 商家发货原点 (1688 抓取地址) |
| `nearest_3pl_wh_id` | INTEGER | **物流锚点**：匹配离该商家最近的合作货代仓库 ID |
| `allow_export_countries`| JSONB | 该商家商品可外贸的国家/地区白名单 (由货代覆盖范围决定) |
| `factory_media` | JSONB | **Shopify CDN URLs** 列表：存储商家资质、工厂实拍视频等。 |
| `is_verified` | BOOLEAN | 是否为认证金牌供应商 |

### 2.2 商品全量信息表 (products)
实现"供应无感化"与"多语言内容"的载体。
| 字段名 | 类型 | 说明 |
|:---|:---|:---|
| `id` | SERIAL | 平台唯一商品 ID |
| `merchant_id` | INTEGER | 关联所属商家 |
| `raw_i18n_content` | JSONB | 原始抓取内容：标题、详情、规格、厂家介绍 (多语言) |
| `optimized_content` | JSONB | **AI 重构版**：符合海外语境、去 1688 痕迹后的卖点文案 |
| `pricing_snapshot` | JSONB | 存储 60% 售价 / 95% 划线价算法生成的快照 |
| `sales_regions` | JSONB | 该商品可销售的海外地区 (受限于货代仓库线路) |
| `inventory_count` | INTEGER | 实时同步库存 |

### 2.3 平台禁售地区表 (restricted_sales_zones) —— NEW
实现"地理围栏"合规的关键。
| 字段名 | 类型 | 说明 |
|:---|:---|:---|
| `iso_code` | VARCHAR(2) | 国家/地区代码 (如: 'RU', 'KP') |
| `restriction_level` | VARCHAR(20) | 禁售等级 (FULL_BLOCK / PARTIAL_CATEGORY) |
| `reason` | TEXT | 禁售原因 (政策/物流/高风险) |
| `butler_explanation` | JSONB | **管家解释话术**：针对该地区的礼貌回绝文案 |

### 2.4 用户实时定位表 (users - 扩展)
| 字段名 | 类型 | 说明 |
|:---|:---|:---|
| `last_login_ip` | INET | 最近登录 IP |
| `detected_region` | VARCHAR(2) | 根据 IP 自动识别的国家代码 |
| `currency_context` | VARCHAR(3) | 自动映射的本地货币 (如: EUR) |
| `fx_rate_applied` | DECIMAL | 实时汇率 + 0.5% 对冲层后的结算汇率 |

---

## 3. 安全与合规逻辑规范

### 3.1 地理围栏拦截逻辑 (Geo-fencing)
*   **前端屏蔽**：若用户 `detected_region` 命中 `restricted_sales_zones`，AI 管家主动引导："抱歉，我们目前尚未开通您所在地区的供应服务。"
*   **下单拦截**：在 Checkout 结算页，系统强制校验 `shipping_address` 的国家代码。若在禁售区，直接阻断支付。

### 3.2 内容隔离与脱敏 (Masking)
*   **源头隐藏**：前端所有商品、商家卡片严禁展示 `supply_merchant_id` 或任何原始 1688 链接。
*   **物流追踪**：用户看到的物流信息为从 `nearest_3pl_wh_id` (合作货代仓) 开始的国际段，隐藏国内段的商家发货细节。

### 3.3 审计与响应
*   **异常 IP 报警**：若同一账户在多个高风险禁售地区频繁切换 IP 尝试下单，自动触发账号风控锁定。
