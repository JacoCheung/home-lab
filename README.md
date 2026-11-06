# 智能家居系统原理设计

从一次设备操作和一次自动化联动出发，研究智能家居系统的组成、通信协议、状态模型与运行边界。

本项目以系统机制为主线。设备品牌和开源平台用于说明机制，内容按设备接入、控制交互、规则执行、故障恢复和安全边界组织。

## 开始阅读

[开篇：智能家居系统的组成与通信](docs/00-introduction.md)

开篇以“夜间开门后亮灯”为贯穿示例，介绍设备、家庭网络、协议接入、控制平台、交互入口和云端服务，并追踪本地控制、自动化联动与远程访问的通信路径。

网页阅读入口为 [`site/index.html`](site/index.html)，与开篇正文同步生成。

## 内容组织

| 主题 | 研究的问题 |
|---|---|
| 系统组成与通信 | 哪些角色参与一次控制，数据怎样经过不同网络 |
| 设备与状态模型 | 如何表达能力、观测状态，以及命令的执行结果 |
| 网络与协议接入 | 如何区分无线连接、IP 路由、协议转换与应用语义 |
| 自动化执行 | 事件如何触发规则，条件判断和动作在哪里执行 |
| 可靠性与恢复 | 断网、掉电、重启和重复消息会影响哪些功能 |
| 身份与权限 | 谁可以接入、读取状态和执行动作 |

当前正文为开篇介绍，其余主题是后续内容的组织方向。

## 原方案归档

原有户型、设备选型、购物清单、部署步骤和交互页面的完整版本保存在 [`archived_main`](https://github.com/JacoCheung/home-lab/tree/archived_main) 分支，归档提交为 [`c764285`](https://github.com/JacoCheung/home-lab/commit/c7642854c6956dd5008f7f9b689990bcf25985d5)。

仓库内原有明细文件暂时保留，新内容从本页和站点首页进入；原方案的阅读入口以归档分支为准。

## 文档维护

正文源文件为 `docs/00-introduction.md`，架构图为 `site/images/system-architecture.svg`。修改正文后重新生成站点首页：

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-docs.txt
.venv/bin/python scripts/build-introduction.py
```

本地预览：

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory site
```

浏览器访问 `http://localhost:8080/`。写作范围、来源边界与维护约定见 [作者备注](docs/00-introduction.notes.md)。
