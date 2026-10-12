# HTML Visual Editor Host Bridge v0.2

这是 HTML Visual Editor 与外部宿主 AI 之间的最小消息契约。它只规定消息形状、校验边界和回写路径，不规定使用哪一家模型，也不把 API key、登录态或模型配置写入生成的 HTML。

## 1. 运行关系

```text
用户在 HTML 页面选择对象并输入自然语言
        ↓
HTML Editor 解析；无法确定时发 edit-request
        ↓
宿主 AI 根据 instruction + selected_ids 生成受控 patch
        ↓
宿主发送 apply-patch
        ↓
HTML Editor 校验 ID、对象类型、属性类型并写入 Deck IR
        ↓
用户预览、撤销/重做、保存 IR
        ↓
按需从最新 IR 生成新的 HTML 或 Native / Hybrid PPTX
```

HTML 与 PPTX 是同一 Deck IR 的两个出口。该桥接不承诺已交付 PPTX 与 HTML 实时双向同步；HTML 编辑后的 PPTX 需要显式重新导出。

## 2. Page → Host: edit request

消息类型：`patrick-ppt-director-edit-request`

```json
{
  "type": "patrick-ppt-director-edit-request",
  "payload": {
    "instruction": "把选中的卡片改成更适合 CFO 的说法",
    "selected_ids": ["P20-exp-mid-2"],
    "ir": { "schema_version": "0.2", "slides": [] }
  }
}
```

宿主应把 `ir` 当作待处理快照，而不是永久来源；回写前仍需按当前页面版本和稳定 ID 做校验。对于不明确、超出对象边界或会改变结构的要求，宿主应返回拒绝或请求用户确认，而不是猜测。

当编辑器嵌入宿主页面时，Deck IR 的 `editor.allowed_origins` 必须使用精确
origin（例如 `https://editor.example`），不得使用 `*`。编辑器会同时校验
`event.source` 与 `event.origin`；未配置受控来源时，跨窗口 patch 会被拒绝。
独立打开的本地 HTML 不向外广播 IR，便于离线使用和防止误泄露。

适配器先 trim，再校验和规范化为 HTTP(S) 精确 origin；域名大小写、默认端口和一个结尾斜杠可规范化。空项、任何通配符（含 `" * "`）、`null`、非 HTTP(S)、路径、查询、片段及凭证一律忽略，不获得权限。出站与入站共用同一白名单；全部无效时仍可独立编辑，但外部桥接关闭。受信宿主必须由本次任务明确配置。

## 3. Host → Page: apply patch

消息类型：`patrick-ppt-director-apply-patch`

```json
{
  "type": "patrick-ppt-director-apply-patch",
  "payload": {
    "patches": [
      {
        "operation": "set_text",
        "target_ids": ["P20-h1"],
        "value": "共享底座决定扩展质量",
        "reason": "用户自然语言要求",
        "source": "assistant",
        "status": "accepted"
      }
    ]
  }
}
```

v0.2 支持的最小操作：

- `set_text`：修改文本对象或带文字的基础形状；
- `move`：使用 `{ "dx": number, "dy": number }`，单位为英寸；
- `resize`：使用 `{ "w": number, "h": number }` 或 `{ "scale": number }`；
- `set_property`：当前仅允许已声明的 `color`、`fill`、`fontSize` 和表格单元格修改；线条对象的 `color` 也属于受控属性；
- `replace_media`：替换已声明的图片或视频媒体对象。

页面必须在应用前重新检查：

1. `target_ids` 是否存在于当前 Deck IR；
2. 操作是否适用于目标对象类型；
3. 数值是否为有限的 number；位移可正、负或零，显式尺寸/缩放为正，修改后几何非负且在画布内（与 IR 共享 0.0001 英寸计算容差）；
4. 属性是否属于白名单；
5. patch 是否带有 `reason`、`source` 和 `status`。

未知属性、任意 CSS/HTML 注入、把复杂视觉对象偷偷转换成文本、以及把文本/表格/图表偷偷转成图片，必须拒绝或显式报告。

程序/宿主/自然语言 patch 的目标几何必须按请求精确应用或拒绝，不静默吸附到边界。一次 `applyPatches` 中任一对象/操作非法时，整批拒绝并保持 IR、撤销/重做历史和 patch 日志不变。缩放水平/垂直线应保留其零维。直接指针拖动仍在画布边界显示约束；这不等于允许程序 patch 静默改写请求。

如果 patch 触及数字文本、表格单元格、图表数据或其他带 `evidence` 的对象，编辑器必须保留原有 `source_refs`，并将相关证据状态标为 `pending`，除非 patch 同时提供了新的来源和完成验证的证据记录。编辑器不得因为自然语言修改成功就把数据重新标成 `verified`。

## 4. Page → Host: result events

编辑器在本地应用 patch 或保存 IR 后，会发送：

- `patrick-ppt-director-ir-patch-applied`：携带已应用的 `patches` 和当前 `ir`；
- `patrick-ppt-director-ir-saved`：携带当前 `ir` 和 patch 日志。

宿主可以据此保存项目状态或触发显式导出，但不得把一次未确认的预览 patch 当作正式交付。

## 5. 安全与产品边界

- 宿主应校验 `event.origin` 或使用同源/受控 iframe；生产环境不得无条件信任 `*`。
- 生成的独立 HTML 不应包含 API key、token、用户登录信息或受保护配置。
- 编辑器只接受 Deck IR patch，不执行宿主返回的任意 JavaScript、HTML 或 CSS。
- v0.2 内置解析器只覆盖常见的改字、移动、尺寸、颜色和字号指令；更复杂的自然语言需要宿主 AI 接入。
- 即使宿主 AI 返回 patch，最终可交付性仍需经过 HTML 保存回读、证据重新核验、PPTX 包检查、PowerPoint 编辑-保存-重开和视觉 QA。
