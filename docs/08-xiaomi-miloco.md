# 小米 Miloco 与当前方案融合

> **Xiaomi Miloco**（[GitHub](https://github.com/XiaoMi/xiaomi-miloco)）是小米开源的「本地智能管家」方案：以**米家摄像机**为视觉源、**端侧大模型**做视频理解，用**自然语言**定义家庭规则与设备控制，并打通**米家生态**。  
> 本文说明如何将 Miloco 作为**可选增强**与现有「Home Assistant + Aqara」方案并存。

---

## 一、Miloco 在本方案中的定位

| 现有方案 | Miloco 补充 |
|----------|-------------|
| Home Assistant：自动化、设备统一控制、3D 仪表盘 | 自然语言设规则、对话式控制 |
| Ollama + 小智 ESP32：语音控制、AI 对话 | 端侧视觉理解（看家场景、视频问答） |
| Frigate：AI 视频分析（人体/快递等） | 大模型级视频理解（更灵活的场景描述） |
| Aqara M3 / 米家：设备执行 | 米家设备/场景的检索与执行、米家通知 |

**融合方式**：二者**并行**。HA 继续管 Aqara、自动化与仪表盘；Miloco 独立运行，负责「摄像头视觉 + 自然语言规则 + 米家设备/场景」。若部分设备同时接入米家与 HA，可同时被两套系统控制（注意避免冲突）。

---

## 二、Miloco 关键特性（摘自官方）

1. **自然语言规则**：用对话方式设定「若…则…」类家庭规则，无需写 YAML。
2. **端侧视觉大模型**：使用 [Xiaomi MiMo-VL-Miloco-7B](https://github.com/XiaoMi/xiaomi-mimo-vl-miloco)，视频在本地解析，隐私可控。
3. **摄像头即感知**：以米家摄像机视频流为输入，解析家中场景并响应用户查询。
4. **米家生态**：控制米家设备、执行米家场景、发送米家/小爱通知。

---

## 三、硬件与软件要求

### 硬件（Miloco 服务器）

| 项目 | 要求 |
|------|------|
| CPU | x64 架构 |
| 显卡 | **NVIDIA 30 系及以上**，显存 **≥8GB**（建议 12GB+） |
| 存储 | 建议 ≥16GB 可用空间（本地模型） |

与当前方案关系：

- 现有 **Mini PC N100** 无独显，无法跑 Miloco；需**单独一台带 NVIDIA GPU 的主机**（或与 Frigate 共用一台 GPU 服务器）。
- 若已有/计划采购「Frigate + Coral/GPU」主机，可优先在同一台机器上部署 Miloco（Docker 同机多容器）。

### 软件

- **系统**：Linux x64（建议 Ubuntu 22.04+ LTS）或 Windows 10+ **WSL2**；macOS 暂不支持。
- **Docker**：20.10+，支持 docker compose。
- **NVIDIA**：宿主机安装 NVIDIA 驱动 + NVIDIA Container Toolkit（Docker 用 GPU）。

---

## 四、需要的设备（与现有方案叠加）

### 1. Miloco 服务器（必选其一）

| 方案 | 说明 | 预算参考 |
|------|------|----------|
| 独显主机 | 台式机/工控机，NVIDIA RTX 3060/4060 等 12GB 显存 | ~2,500–4,500 元 |
| 二手 GPU 服务器 | 旧工作站 + 30 系显卡 | 视成色而定 |
| 与 Frigate 共用 | 若已有 Frigate GPU 主机，同机部署 Miloco | 0（仅软件） |

### 2. 摄像头（视觉源）

Miloco 官方以**米家摄像机**为视频输入源：

| 设备 | 说明 | 预算参考 |
|------|------|----------|
| 米家智能摄像机 2 标准版 / Pro | 接入米家，供 Miloco 拉流 | ~99–299 元 |
| 已有 Aqara G5 Pro / 米家兼容摄像头 | 若 Miloco 或社区支持该型号，可先尝试复用 | 0 |

当前方案中已有 **Aqara G5 Pro**（客厅）；若后续 Miloco 支持通过 RTSP/ONVIF 或米家网关接入该画面，可减少重复采购。**新增部署时**建议至少 1 台**米家原生摄像机**保证兼容。

### 3. 米家生态（可选）

- 若家中已有**米家/米家兼容设备**（灯、插座、传感器等），Miloco 可直接控制并编排场景。
- 本方案以 **Aqara** 为主，Aqara 设备多数也接入**米家 App**，理论上可被 Miloco 通过米家生态控制；与 HA 同时控制时需注意场景与自动化不要冲突。

---

## 五、部署步骤概要

1. **准备一台 x64 + NVIDIA 30 系+ 8GB 显存的主机**，安装 Ubuntu 22.04 或 Windows WSL2，安装 Docker 与 NVIDIA Container Toolkit。
2. **安装 Miloco**（任选其一）：
   ```bash
   bash -c "$(wget -qO- https://xiaomi-miloco.cnbj1.mi-fds.com/xiaomi-miloco/install.sh)"
   ```
   或克隆仓库后执行：
   ```bash
   git clone https://github.com/XiaoMi/xiaomi-miloco.git
   bash scripts/install.sh
   ```
3. 在 Miloco 中**添加米家账号**、**绑定米家摄像机**为视觉源。
4. 在 Miloco 中**用自然语言配置家庭规则**、测试设备/场景控制。
5. （可选）与 HA 联动：通过米家桥接或 Webhook 等方式，让 Miloco 触发 HA 自动化或状态同步（需自行探索/社区方案）。

详细安装与配置见官方：[Docker 部署文档](https://github.com/XiaoMi/xiaomi-miloco/tree/main/docs)、[使用文档](https://github.com/XiaoMi/xiaomi-miloco/tree/main/docs/usage)。

---

## 六、与现有六阶段的关系

建议将 Miloco 作为**第七阶段（可选）**或**与第六阶段并行**的增强：

| 阶段 | 内容 | Miloco 关系 |
|------|------|-------------|
| 第一～五阶段 | Aqara 设备、HA、语音、DIY 传感器 | 不变 |
| 第六阶段 | 3D 仪表盘、Frigate、go2rtc | 若有 GPU 主机，可同机部署 Miloco |
| **第七阶段（可选）** | **Xiaomi Miloco** | 部署 Miloco、接米家摄像头、设自然语言规则、与米家/HA 联动 |

---

## 七、预算与清单（可选）

| 项目 | 数量 | 预算参考 | 说明 |
|------|------|----------|------|
| Miloco 服务器（NVIDIA 30 系+ 8GB 显存） | 1 | ~2,500–4,500 元 | 可与 Frigate 共用 |
| 米家智能摄像机 | 1 | ~99–299 元 | 视觉源，已有米家摄像头可尝试复用 |
| **合计（可选）** | — | **~2,600–4,800 元** | 按需采购 |

---

## 八、参考链接

- [Xiaomi Miloco 官方仓库](https://github.com/XiaoMi/xiaomi-miloco)
- [MiMo-VL-Miloco-7B 端侧模型](https://github.com/XiaoMi/xiaomi-mimo-vl-miloco)
- [Miloco 使用文档](https://github.com/XiaoMi/xiaomi-miloco/tree/main/docs/usage)（含中文）
