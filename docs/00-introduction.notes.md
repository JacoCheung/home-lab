# 开篇作者备注

## 原文保留

- 按用户要求，正文直接采用会话中关于智能家居系统组成与通信的完整回答。
- 保持原回答的措辞、顺序、加粗、表格、链路示例、引用链接和 Mermaid 源码，不扩写、润色或重组。
- 正文以“一个智能家居系统，可以拆成”开头，不另加导语、教学示例、练习或结论。
- 原有具体方案的完整历史入口仍为 `archived_main`。

## 文件维护

- 正文：`docs/00-introduction.md`。
- 图源：正文中的 Mermaid 代码块，GitHub 可直接渲染。
- 网页架构图：`site/images/system-architecture.svg`，由原始 Mermaid 代码使用 `@mermaid-js/mermaid-cli@11.12.0` 生成；修改图源时需同步重新生成 SVG。
- 网页：运行 `scripts/build-introduction.py` 生成 `site/index.html`；构建过程只处理展示和导航，正文内容不作改写。
