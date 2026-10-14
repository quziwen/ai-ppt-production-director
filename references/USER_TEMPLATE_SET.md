# 用户可选模板集

当用户要看模板、选模板、沿用以前喜欢的版式，或制作财务/经营汇报时，先检查当前 Skill 内的 `assets/templates/user-collections/*/catalog.json`，再按本次内容选择。路径相对于主 SKILL.md，跨工作区不需要回找原 PPT_Codex。

## 发现、选择与使用

- `node scripts/template_library.cjs --list` 列出已安装的模板。用 `--query 预算`、`--query 现金` 或 `--kind html-layout-template` 缩小范围。
- 为用户提供名称、编号、用途和本地示例图。没有指定模板时，按当前页面的问题推荐少量适合的版式；已指定编号则直接读取相应条目，不重新让用户选择。
- `node scripts/template_library.cjs --show FA03` 读取具体素材、主题、页码、偏好维度和可编辑性边界。
- `node scripts/template_library.cjs --materialize FA03 --out <本次工作区新目录> --theme shenzhen` 将所需素材复制到本次工作区。输出目录不得已有；该操作记录模板选择，不自动生产正式 Deck。
- 将 `template-selection.json` 的模板编号、主题及实际使用材料写入本次既有 style_contract；不要另外复制出一份长期风格规范。

模板包中的 `index.html` 是本地看图入口，`catalog.json` 是调用入口。浏览器数据 `catalog.js` 由 catalog.json 派生。更新模板目录时一并更新派生预览。

## 当前 Patrick 选样集

`assets/templates/user-collections/patrick-20261014/catalog.json` 包含 Patrick 于 2026-10-14 选定的 40 项：

| 类型 | 内容 | 生产入口 |
|---|---|---|
| 原生 PPTX 版式 23 项 | FA02—FA10；ER01—ER06；CC01—CC08 | 两色样张 PPTX、patterns.json、themes.json、合成数据、build.cjs |
| HTML 版式 8 项 | 8-Bit Orbit、Blue Professional、Broadside、Cartesian、Grove、Long Table、Monochrome、Pink Script | HTML 原源码与三张官方样图 |
| 视觉参考 9 项 | 所选文章中的比较表、咨询/研究页面及密集结构 | 本地原参考图、结构使用说明；制作时重建所需对象 |

默认主题是 `shenzhen`；财务三组还提供各自参考配色。每项分别记录 `selected.layout`、`selected.chart`、`selected.color`。未勾选配色的条目，原色只用于看样，制作副本优先用当前用户指定的主题。勾选原色表示可选，仍可以换色。用户本次明确的新选择优先于此前选样偏好。

选样偏好归属该用户，不自动成为通用用户或其他项目的强制风格。模板仍服从本次工作区正式规范和 Deck Brief；不要求全部 Deck 使用同一种密度或按素材包顺序分页。

## 素材类型与验证

- 原生样张可用于复制页面和对象；合成数据与源样图数字不能带入实际业务结论。`PRIOR_QA.md` 保留历史证据，不代表本次数据编辑刷新已经通过。
- HTML 源码可以修改；请求 PPTX 时仍经当前原生/Hybrid 路线导出并检查。字体、像素与点单位、预览缩放和中文断行以真实输出核对。
- 视觉参考中的产品界面、广告、图表截图和正式幻灯片先看图识别。将本次文字、表格及数据图重建为满足 E/H 目标的对象；不能把整页图片命名为“可编辑 PPTX”。
- 选择认可、素材导入、实际制作、视觉检查和编辑保存重开分别记录。模板集不改变已批准的可编辑目标或降低 QA。

## 安装与打包

用户模板集与当前主 Skill 一起安装，即可跨项目调用。v0.3.7 的 `with-templates` 公开安装包包含本次已获发布授权的40项；`standard` 轻量包不包含该集合。打包时用 `scripts/package-codex.ps1 -IncludeUserTemplates` 保留可选素材。该次发布不授权上传其他用户模板、长期SSOT或业务文件。不要用文章提及的生产工具替换既有导演流程。

目录中 `originalProjectResource` 只保留导入来源线索，不是运行时读取路径；跨项目使用以本地 `resources`、`previewImages` 和 `nativeDecks` 为准。
