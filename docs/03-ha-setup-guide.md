# Home Assistant 安装与配置指南

> Mini PC (N100) + Docker 部署，集成 Aqara、Node-RED、HACS 等

---

## 一、硬件准备

- **Mini PC**: Intel N100, 8GB RAM, 256GB SSD
- **系统**: Ubuntu Server 24.04 LTS 或 Debian 12
- **网络**: 有线连接到路由器（推荐固定 IP，例如 `192.168.1.10`）

---

## 二、安装 Docker + Home Assistant

### 2.1 安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# 重新登录使权限生效
```

### 2.2 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  homeassistant:
    container_name: homeassistant
    image: ghcr.io/home-assistant/home-assistant:stable
    volumes:
      - ./ha-config:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
    restart: unless-stopped
    privileged: true
    network_mode: host

  mosquitto:
    container_name: mosquitto
    image: eclipse-mosquitto:2
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    ports:
      - "1883:1883"
      - "9001:9001"
    restart: unless-stopped

  nodered:
    container_name: nodered
    image: nodered/node-red:latest
    volumes:
      - ./nodered-data:/data
    ports:
      - "1880:1880"
    restart: unless-stopped
    depends_on:
      - mosquitto

  go2rtc:
    container_name: go2rtc
    image: alexxit/go2rtc:latest
    network_mode: host
    volumes:
      - ./go2rtc:/config
    restart: unless-stopped

  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8080:80/tcp"
    environment:
      TZ: 'Asia/Shanghai'
      WEBPASSWORD: 'changeme'
    volumes:
      - ./pihole/etc-pihole:/etc/pihole
      - ./pihole/etc-dnsmasq.d:/etc/dnsmasq.d
    restart: unless-stopped
```

### 2.3 启动

```bash
docker compose up -d
```

访问 `http://192.168.1.10:8123` 完成 HA 初始设置。

---

## 三、集成 Aqara 设备

### 方式一：Matter（推荐）

1. Aqara M3 固件更新到最新版
2. Aqara Home App -> M3 -> 设置 -> Matter -> 生成配对码
3. HA -> 设置 -> 设备与服务 -> 添加集成 -> Matter
4. 输入配对码，M3 下的所有设备将自动发现

### 方式二：HomeKit Controller

1. Aqara Home App -> M3 -> 设置 -> HomeKit -> 获取配对码
2. HA -> 设置 -> 设备与服务 -> 添加集成 -> HomeKit Controller
3. 输入配对码

### 方式三：Aqara 官方集成（云端）

1. HA -> HACS -> 搜索 "Aqara" -> 安装
2. 用 Aqara 账号登录授权

> 推荐 Matter 方式：本地通信、低延迟、不依赖云端

---

## 四、安装 HACS（自定义组件商店）

```bash
# 在 HA 容器内执行
docker exec -it homeassistant bash
wget -O - https://get.hacs.xyz | bash -
# 重启 HA
docker restart homeassistant
```

重启后：HA -> 设置 -> 设备与服务 -> 添加集成 -> HACS -> 用 GitHub 账号授权

### 必装 HACS 插件

| 插件 | 用途 |
|------|------|
| Adaptive Lighting | 昼夜节律自动调色温亮度 |
| browser_mod | 仪表盘弹出面板 |
| tv-card | 电视遥控器卡片 |
| mini-media-player | 迷你音乐播放器卡片 |
| mushroom | 现代风格仪表盘卡片 |
| button-card | 高度自定义按钮卡片 |

---

## 五、配置 Mosquitto MQTT

创建配置文件 `mosquitto/config/mosquitto.conf`:

```
listener 1883
allow_anonymous false
password_file /mosquitto/config/password.txt
```

创建用户:

```bash
docker exec -it mosquitto mosquitto_passwd -c /mosquitto/config/password.txt ha
# 输入密码
```

HA 中添加 MQTT 集成：设置 -> 集成 -> MQTT -> broker: `localhost`, 端口: 1883

---

## 六、配置 go2rtc 摄像头流

创建 `go2rtc/go2rtc.yaml`:

```yaml
streams:
  living_room_cam:
    - rtsp://admin:password@192.168.1.20:554/live
  doorbell:
    - rtsp://admin:password@192.168.1.21:554/live
```

> 将 IP 和密码替换为实际的摄像头地址。
> go2rtc 启动后访问 `http://192.168.1.10:1984` 验证流是否正常。

---

## 七、关键 HA 配置文件

### configuration.yaml 补充

```yaml
homeassistant:
  name: 我的智能家
  unit_system: metric
  time_zone: Asia/Shanghai
  currency: CNY
  latitude: !secret latitude
  longitude: !secret longitude

logger:
  default: warning
  logs:
    homeassistant.components.automation: info

input_boolean:
  guest_mode:
    name: 访客模式
    icon: mdi:account-group
  do_not_disturb:
    name: 勿扰模式
    icon: mdi:bell-off
  away_mode:
    name: 离家模式
    icon: mdi:home-export-outline
  sleep_mode:
    name: 睡眠模式
    icon: mdi:sleep
  movie_mode:
    name: 观影模式
    icon: mdi:movie-open
  party_mode:
    name: 聚会模式
    icon: mdi:party-popper
  work_mode:
    name: 多功能室工作模式
    icon: mdi:desk
  study_sleep_mode:
    name: 多功能室睡眠模式
    icon: mdi:bed

input_select:
  home_mode:
    name: 家庭模式
    options:
      - 在家
      - 离家
      - 睡眠
      - 观影
      - 聚会
      - 度假
    initial: 在家
    icon: mdi:home

recorder:
  purge_keep_days: 30
  commit_interval: 5

# 自适应照明（HACS 安装后）
adaptive_lighting:
  - name: "客厅"
    lights:
      - light.living_room_group
    min_brightness: 20
    max_brightness: 100
    min_color_temp: 2700
    max_color_temp: 6500
    sleep_brightness: 5
    sleep_color_temp: 2700
  - name: "主卧"
    lights:
      - light.master_bedroom_group
    min_brightness: 15
    max_brightness: 80
    min_color_temp: 2700
    max_color_temp: 5000
    sleep_brightness: 1
    sleep_color_temp: 2700
```

---

## 八、实用 HA 模板传感器

在 `configuration.yaml` 中添加:

```yaml
template:
  - sensor:
      - name: "全屋灯光开启数"
        state: >
          {{ states.light
             | selectattr('state', 'eq', 'on')
             | list | count }}

      - name: "全屋窗帘状态"
        state: >
          {% set open = states.cover
             | selectattr('state', 'eq', 'open')
             | list | count %}
          {% set total = states.cover | list | count %}
          {{ open }}/{{ total }} 已开启

      - name: "低电量设备"
        state: >
          {% set low = states.sensor
             | selectattr('attributes.device_class', 'defined')
             | selectattr('attributes.device_class', 'eq', 'battery')
             | selectattr('state', 'lt', '20')
             | list %}
          {{ low | count }} 个设备电量低

  - binary_sensor:
      - name: "有人在家"
        state: >
          {{ is_state('binary_sensor.fp2_living_room', 'on')
             or is_state('binary_sensor.fp2_master_bedroom', 'on')
             or is_state('binary_sensor.fp2_study', 'on') }}
```

---

## 九、Node-RED 集成

HA 中安装 Node-RED Companion 集成:

1. HACS -> 集成 -> 搜索 "Node-RED Companion" -> 安装
2. 设置 -> 集成 -> 添加 Node-RED

Node-RED 访问 `http://192.168.1.10:1880`，安装 HA 节点:

- 菜单 -> Manage palette -> Install -> `node-red-contrib-home-assistant-websocket`
- 配置 HA 连接: `http://homeassistant:8123` + Long-Lived Access Token

---

## 十、手机端配置

### iOS / Android

1. 安装 "Home Assistant" Companion App
2. 输入 HA 地址: `http://192.168.1.10:8123`（局域网）
3. 外网访问方案:
   - Nabu Casa 订阅（最简单，$6.5/月）
   - Cloudflare Tunnel（免费，需域名）
   - Tailscale/ZeroTier（免费 VPN 方案）

### NFC 标签

1. HA -> 设置 -> 标签 -> 创建新标签
2. 手机NFC写入标签ID
3. 创建自动化: 触发器=标签扫描 -> 动作=切换场景

---

## 下一步

- 配置自动化场景 -> 参见 [04-automations.md](04-automations.md)
- 部署语音助手 -> 参见 [05-voice-assistant.md](05-voice-assistant.md)
- 制作 3D 仪表盘 -> 参见 [06-3d-dashboard.md](06-3d-dashboard.md)
