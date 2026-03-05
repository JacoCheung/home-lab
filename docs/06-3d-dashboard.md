# 3D 交互仪表盘制作指南

> 在 Home Assistant 中创建可点击控制设备的 3D 户型图仪表盘

---

## 效果说明

- 3D 渲染的户型图作为背景，灯光状态会实时反映在图中（亮/灭）
- 点击任意设备图标弹出控制面板（灯光调节、窗帘、空调遥控器、电视遥控器）
- 点击摄像头图标弹出实时画面（WebRTC 亚秒延迟）
- 底部/侧边可切换房间视角
- 手机和电脑均可访问

---

## 一、准备 3D 渲染图

### 1.1 工具

- **SketchUp Free** 或 **Sweet Home 3D**（免费）
- **GIMP**（免费，处理图层）

### 1.2 渲染步骤

为每个房间视角渲染至少 3 张图：

| 图片 | 描述 | 用途 |
|------|------|------|
| `base_lights_off.png` | 所有灯关闭的基础图 | 仪表盘底层 |
| `lights_on_group_A.png` | 只有 A 组灯打开 | 叠加层，灯亮时显示 |
| `lights_on_group_B.png` | 只有 B 组灯打开 | 叠加层，灯亮时显示 |
| `curtain_open.png` | 窗帘打开 | 叠加层 |
| `curtain_closed.png` | 窗帘关闭 | 叠加层 |

### 1.3 GIMP 处理

1. 打开灯亮图，选择灯光区域以外的部分
2. 删除非灯光区域使其透明
3. 导出为 PNG（保留 Alpha 透明通道）
4. 上传到 HA: `/config/www/floorplan/`

---

## 二、Picture Elements 卡片配置

### 2.1 基础结构

```yaml
type: picture-elements
image: /local/floorplan/living_room_base.png
elements:
  # === 灯光图层 ===
  - type: image
    entity: light.living_room_ceiling_group
    image: /local/floorplan/living_room_lights_on.png
    state_filter:
      "on": opacity(1)
      "off": opacity(0)
    style:
      top: 50%
      left: 50%
      width: 100%
      mix-blend-mode: screen

  # === 窗帘图层 ===
  - type: image
    entity: cover.living_room_curtains
    image: /local/floorplan/curtain_closed.png
    state_filter:
      closed: opacity(1)
      open: opacity(0)
    style:
      top: 50%
      left: 50%
      width: 100%

  # === 设备控制点 ===

  # 灯光开关
  - type: state-icon
    entity: light.living_room_ceiling_group
    icon: mdi:ceiling-light
    tap_action:
      action: toggle
    hold_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          content:
            type: custom:mushroom-light-card
            entity: light.living_room_ceiling_group
            show_brightness_control: true
            show_color_temp_control: true
    style:
      top: 30%
      left: 50%
      "--iron-icon-fill-color": >
        {% if is_state('light.living_room_ceiling_group', 'on') %}
          gold
        {% else %}
          gray
        {% endif %}

  # 窗帘控制
  - type: state-icon
    entity: cover.living_room_curtains
    icon: mdi:curtains
    tap_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          content:
            type: entities
            entities:
              - entity: cover.living_room_curtain_left
                type: custom:mushroom-cover-card
              - entity: cover.living_room_curtain_right
                type: custom:mushroom-cover-card
              - entity: cover.living_room_curtain_west
                type: custom:mushroom-cover-card
    style:
      top: 15%
      left: 80%

  # 空调控制
  - type: state-icon
    entity: climate.central_ac
    icon: mdi:air-conditioner
    tap_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          content:
            type: custom:mushroom-climate-card
            entity: climate.central_ac
            show_temperature_control: true
            hvac_modes:
              - heat
              - cool
              - auto
              - "off"
    style:
      top: 10%
      left: 30%

  # 电视遥控器
  - type: state-icon
    entity: media_player.living_room_tv
    icon: mdi:television
    tap_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          title: "电视遥控器"
          content:
            type: custom:tv-card
            entity: media_player.living_room_tv
            tv: true
            keys:
              power:
                service: remote.send_command
                target:
                  entity_id: remote.m3_ir
                data:
                  command: power
                  device: tv
              volume_up:
                service: remote.send_command
                target:
                  entity_id: remote.m3_ir
                data:
                  command: vol_up
                  device: tv
              volume_down:
                service: remote.send_command
                target:
                  entity_id: remote.m3_ir
                data:
                  command: vol_down
                  device: tv
              channel_up:
                service: remote.send_command
                target:
                  entity_id: remote.m3_ir
                data:
                  command: ch_up
                  device: tv
              channel_down:
                service: remote.send_command
                target:
                  entity_id: remote.m3_ir
                data:
                  command: ch_down
                  device: tv
    style:
      top: 60%
      left: 70%

  # 摄像头 (WebRTC 低延迟)
  - type: state-icon
    entity: camera.living_room_g3
    icon: mdi:cctv
    tap_action:
      action: fire-dom-event
      browser_mod:
        service: browser_mod.popup
        data:
          title: "客厅摄像头"
          content:
            type: custom:webrtc-camera
            entity: camera.living_room_g3
            url: "living_room_cam"
    style:
      top: 20%
      left: 90%

  # 温湿度显示
  - type: state-label
    entity: sensor.living_room_temperature
    prefix: "🌡"
    suffix: "°C"
    style:
      top: 85%
      left: 15%
      color: white
      font-size: 14px
      text-shadow: 1px 1px 2px black

  - type: state-label
    entity: sensor.living_room_humidity
    prefix: "💧"
    suffix: "%"
    style:
      top: 90%
      left: 15%
      color: white
      font-size: 14px
      text-shadow: 1px 1px 2px black

  # 当前模式显示
  - type: state-label
    entity: input_select.home_mode
    prefix: "模式: "
    style:
      top: 5%
      left: 50%
      color: white
      font-size: 16px
      font-weight: bold
      text-shadow: 1px 1px 2px black
```

---

## 三、多房间切换

使用 `input_select` + `conditional` 实现房间切换：

### 3.1 定义房间选择器

在 `configuration.yaml` 中:

```yaml
input_select:
  dashboard_room:
    name: 仪表盘房间
    options:
      - 客厅
      - 主卧
      - 次卧
      - 多功能室
      - 厨房
    initial: 客厅
    icon: mdi:floor-plan
```

### 3.2 仪表盘使用 conditional 卡片

```yaml
type: vertical-stack
cards:
  # 房间切换按钮
  - type: horizontal-stack
    cards:
      - type: custom:mushroom-chips-card
        chips:
          - type: action
            content: 客厅
            tap_action:
              action: call-service
              service: input_select.select_option
              target:
                entity_id: input_select.dashboard_room
              data:
                option: 客厅
          - type: action
            content: 主卧
            tap_action:
              action: call-service
              service: input_select.select_option
              target:
                entity_id: input_select.dashboard_room
              data:
                option: 主卧
          - type: action
            content: 次卧
            tap_action:
              action: call-service
              service: input_select.select_option
              target:
                entity_id: input_select.dashboard_room
              data:
                option: 次卧
          - type: action
            content: 多功能室
            tap_action:
              action: call-service
              service: input_select.select_option
              target:
                entity_id: input_select.dashboard_room
              data:
                option: 多功能室

  # 客厅视图
  - type: conditional
    conditions:
      - entity: input_select.dashboard_room
        state: 客厅
    card:
      type: picture-elements
      image: /local/floorplan/living_room_base.png
      elements:
        # ... 客厅的所有元素 ...

  # 主卧视图
  - type: conditional
    conditions:
      - entity: input_select.dashboard_room
        state: 主卧
    card:
      type: picture-elements
      image: /local/floorplan/master_bedroom_base.png
      elements:
        # ... 主卧的所有元素 ...
```

---

## 四、go2rtc 摄像头低延迟配置

### 4.1 go2rtc 配置

`go2rtc/go2rtc.yaml`:

```yaml
streams:
  living_room_cam:
    - rtsp://admin:password@192.168.1.20:554/live
  doorbell:
    - rtsp://admin:password@192.168.1.21:554/live

webrtc:
  ice_servers:
    - urls: [stun:stun.l.google.com:19302]
```

### 4.2 HA 中安装 WebRTC Camera（HACS）

1. HACS -> 前端 -> 搜索 "WebRTC Camera" -> 安装
2. 设置 -> 集成 -> 添加 WebRTC Camera -> URL: `http://localhost:1984`

### 4.3 在仪表盘中使用

```yaml
type: custom:webrtc-camera
entity: camera.living_room_g3
url: "living_room_cam"  # 对应 go2rtc 中的 stream 名
```

延迟通常在 0.5-1 秒之间（WebRTC 方式）。

---

## 五、手机端适配

### 5.1 方案一：Companion App（推荐）

安装 HA Companion App，仪表盘自动适配。可设置手机专用仪表盘:

1. HA -> 设置 -> 仪表盘 -> 新建仪表盘 -> "手机版"
2. 使用较少的图层和更大的触控区域
3. 在 Companion App 中设置默认仪表盘为手机版

### 5.2 响应式设计技巧

在 `picture-elements` 中:

```yaml
# 手机上隐藏不必要的元素
- type: state-icon
  entity: sensor.xxx
  style:
    top: 10%
    left: 10%
    display: >
      {% if is_state('binary_sensor.mobile', 'on') %}
        none
      {% else %}
        block
      {% endif %}
```

或使用 `custom:layout-card` 配合断点:

```yaml
type: custom:layout-card
layout_type: grid
layout:
  grid-template-columns: 1fr
  mediaquery:
    "(min-width: 768px)":
      grid-template-columns: 1fr 1fr
```

---

## 六、性能优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| 图片压缩 | 渲染图用 WebP 格式 | 加载速度快 50% |
| 懒加载摄像头 | 点击才加载 WebRTC 流 | 减少带宽 |
| 减少图层 | 合并不常变的图层 | 渲染更快 |
| 本地网络 | HA 走有线/5GHz Wi-Fi | 延迟 <100ms |
| browser_mod 缓存 | 弹出面板预加载 | 打开更快 |

---

## 七、所需 HACS 前端插件清单

```
browser_mod          - 弹出面板
webrtc-camera        - 低延迟摄像头
mushroom             - 现代风格卡片
tv-card              - 电视遥控器
mini-media-player    - 音乐播放器
button-card          - 自定义按钮
layout-card          - 响应式布局
card-mod             - CSS 样式自定义
```

全部在 HACS -> 前端 中搜索安装。
