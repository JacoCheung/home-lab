# 全屋自动化场景 YAML 模板

> 复制到 HA 的 automations.yaml 或通过 UI 创建
> entity_id 需替换为你实际的设备 ID

---

## 一、到家模式

```yaml
alias: "到家模式"
description: "开门后自动开灯、开窗帘、播报欢迎词"
trigger:
  - platform: state
    entity_id: lock.d200_front_door
    to: "unlocked"
  - platform: state
    entity_id: binary_sensor.fp2_entrance
    to: "on"
condition:
  - condition: state
    entity_id: input_boolean.away_mode
    state: "on"
action:
  - service: input_boolean.turn_off
    target:
      entity_id: input_boolean.away_mode
  - service: input_select.select_option
    target:
      entity_id: input_select.home_mode
    data:
      option: "在家"
  - service: light.turn_on
    target:
      entity_id:
        - light.entrance_group
        - light.hallway_group
        - light.living_room_group
    data:
      brightness_pct: 80
      color_temp_kelvin: 4000
  - service: cover.open_cover
    target:
      entity_id: cover.living_room_curtains
  - delay: "00:00:02"
  - service: tts.speak
    target:
      entity_id: tts.piper
    data:
      media_player_entity_id: media_player.living_room_speaker
      message: >
        欢迎回家！现在是 {{ now().strftime('%H点%M分') }}，
        室内温度 {{ states('sensor.living_room_temperature') }}度，
        湿度 {{ states('sensor.living_room_humidity') }}%。
mode: single
```

---

## 二、离家模式

```yaml
alias: "离家模式"
description: "全屋关灯关窗帘，启动扫地机，布防"
trigger:
  - platform: state
    entity_id: lock.d200_front_door
    to: "locked"
    for: "00:03:00"
condition:
  - condition: state
    entity_id: binary_sensor.anyone_home
    state: "off"
    for: "00:02:00"
action:
  - service: input_boolean.turn_on
    target:
      entity_id: input_boolean.away_mode
  - service: input_select.select_option
    target:
      entity_id: input_select.home_mode
    data:
      option: "离家"
  - service: light.turn_off
    target:
      entity_id: all
  - service: cover.close_cover
    target:
      entity_id: all
  - service: climate.set_hvac_mode
    target:
      entity_id: climate.central_ac
    data:
      hvac_mode: "off"
  - service: vacuum.start
    target:
      entity_id: vacuum.dreame_x40
  - service: notify.mobile_app
    data:
      title: "离家模式已启动"
      message: "灯光已关闭，窗帘已合上，扫地机已启动，安防已布防。"
mode: single
```

---

## 三、睡眠模式

```yaml
alias: "睡眠模式"
description: "渐暗灯光、关窗帘、播放轻音乐"
trigger:
  - platform: state
    entity_id: input_boolean.sleep_mode
    to: "on"
action:
  - service: light.turn_off
    target:
      entity_id:
        - light.living_room_group
        - light.kitchen_light
        - light.hallway_group
  - service: light.turn_on
    target:
      entity_id: light.master_bedroom_strip
    data:
      brightness_pct: 5
      color_temp_kelvin: 2700
    # 过渡3分钟渐暗
  - service: cover.close_cover
    target:
      entity_id:
        - cover.master_bedroom_curtain_north
        - cover.master_bedroom_curtain_east
  - service: media_player.play_media
    target:
      entity_id: media_player.bedroom_speaker
    data:
      media_content_id: "轻音乐睡眠"
      media_content_type: "playlist"
  - delay: "00:30:00"
  - service: media_player.turn_off
    target:
      entity_id: media_player.bedroom_speaker
  - service: light.turn_off
    target:
      entity_id: light.master_bedroom_strip
mode: single
```

---

## 四、起夜微光

```yaml
alias: "起夜微光引导"
description: "夜间检测到下床，打开微弱灯带"
trigger:
  - platform: state
    entity_id: binary_sensor.bed_pressure_master
    from: "on"
    to: "off"
condition:
  - condition: time
    after: "22:00:00"
    before: "07:00:00"
  - condition: state
    entity_id: input_boolean.sleep_mode
    state: "on"
action:
  - service: light.turn_on
    target:
      entity_id: light.master_bedroom_strip
    data:
      brightness_pct: 3
      color_temp_kelvin: 2700
  - wait_for_trigger:
      - platform: state
        entity_id: binary_sensor.bed_pressure_master
        to: "on"
    timeout: "00:15:00"
  - service: light.turn_off
    target:
      entity_id: light.master_bedroom_strip
    data:
      transition: 30
mode: restart
```

---

## 五、卫生间自动灯

```yaml
alias: "主卫自动灯"
description: "人来亮灯，人走2分钟后关灯"
trigger:
  - platform: state
    entity_id: binary_sensor.p2_master_bathroom
    to: "on"
action:
  - service: light.turn_on
    target:
      entity_id: light.master_bathroom
    data:
      brightness_pct: >
        {% if now().hour >= 22 or now().hour < 7 %}
          20
        {% else %}
          100
        {% endif %}
  - wait_for_trigger:
      - platform: state
        entity_id: binary_sensor.p2_master_bathroom
        to: "off"
        for: "00:02:00"
    timeout: "01:00:00"
  - service: light.turn_off
    target:
      entity_id: light.master_bathroom
mode: restart
```

---

## 六、观影模式

```yaml
alias: "观影模式"
description: "关灯、暗氛围灯、关窗帘、开电视"
trigger:
  - platform: state
    entity_id: input_boolean.movie_mode
    to: "on"
action:
  - service: light.turn_off
    target:
      entity_id: light.living_room_ceiling_group
  - service: light.turn_on
    target:
      entity_id: light.living_room_strip
    data:
      brightness_pct: 10
      color_temp_kelvin: 2700
  - service: cover.close_cover
    target:
      entity_id: cover.living_room_curtains
  - service: remote.send_command
    target:
      entity_id: remote.m3_ir
    data:
      command: "power_on"
      device: "tv"
  - service: input_select.select_option
    target:
      entity_id: input_select.home_mode
    data:
      option: "观影"
mode: single
```

---

## 七、聚会模式

```yaml
alias: "聚会模式"
description: "WLED彩色效果、音乐、适中灯光"
trigger:
  - platform: state
    entity_id: input_boolean.party_mode
    to: "on"
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room_ceiling_group
    data:
      brightness_pct: 60
      color_temp_kelvin: 3500
  - service: light.turn_on
    target:
      entity_id: light.wled_living_room
    data:
      effect: "Rainbow"
      brightness_pct: 80
  - service: media_player.play_media
    target:
      entity_id: media_player.living_room_speaker
    data:
      media_content_id: "聚会歌单"
      media_content_type: "playlist"
mode: single
```

---

## 八、音乐律动灯光

```yaml
alias: "听歌模式"
description: "WLED灯带跟随音乐节奏变化"
trigger:
  - platform: state
    entity_id: media_player.living_room_speaker
    to: "playing"
condition:
  - condition: state
    entity_id: input_boolean.music_sync_mode
    state: "on"
action:
  - service: light.turn_on
    target:
      entity_id: light.wled_living_room
    data:
      effect: "音频反应"
      brightness_pct: 100
mode: single
```

> 注: WLED 的音频反应模式需在 WLED 固件中配置麦克风输入（INMP441）

---

## 九、多功能室工作/睡眠模式切换

```yaml
alias: "多功能室-工作模式"
description: "高亮冷白灯、开窗帘、关氛围灯"
trigger:
  - platform: state
    entity_id: input_boolean.work_mode
    to: "on"
action:
  - service: input_boolean.turn_off
    target:
      entity_id: input_boolean.study_sleep_mode
  - service: light.turn_on
    target:
      entity_id: light.study_ceiling_group
    data:
      brightness_pct: 100
      color_temp_kelvin: 5000
  - service: light.turn_off
    target:
      entity_id: light.study_strip
  - service: cover.open_cover
    target:
      entity_id: cover.study_curtains
  - service: cover.open_cover
    target:
      entity_id: cover.study_bed_curtain
mode: single
```

```yaml
alias: "多功能室-睡眠模式"
description: "暗暖灯、关窗帘、放下床帘"
trigger:
  - platform: state
    entity_id: input_boolean.study_sleep_mode
    to: "on"
action:
  - service: input_boolean.turn_off
    target:
      entity_id: input_boolean.work_mode
  - service: light.turn_off
    target:
      entity_id: light.study_ceiling_group
  - service: light.turn_on
    target:
      entity_id: light.study_strip
    data:
      brightness_pct: 5
      color_temp_kelvin: 2700
  - service: cover.close_cover
    target:
      entity_id:
        - cover.study_curtains
        - cover.study_bed_curtain
mode: single
```

---

## 十、空气质量联动

```yaml
alias: "空气质量差开新风"
description: "CO2超标自动开新风"
trigger:
  - platform: numeric_state
    entity_id: sensor.qingping_co2
    above: 1000
action:
  - service: remote.send_command
    target:
      entity_id: remote.m3_ir
    data:
      command: "power_on"
      device: "fresh_air"
  - service: notify.mobile_app
    data:
      title: "空气质量提醒"
      message: "CO2浓度 {{ states('sensor.qingping_co2') }}ppm，已自动开启新风系统"
mode: single
```

---

## 十一、入侵报警

```yaml
alias: "入侵报警"
description: "离家模式下检测到人体，发送紧急通知"
trigger:
  - platform: state
    entity_id:
      - binary_sensor.fp2_living_room
      - binary_sensor.fp2_entrance
    to: "on"
condition:
  - condition: state
    entity_id: input_boolean.away_mode
    state: "on"
action:
  - service: camera.snapshot
    target:
      entity_id: camera.living_room_g3
    data:
      filename: "/config/www/snapshots/intrusion_{{ now().strftime('%Y%m%d_%H%M%S') }}.jpg"
  - service: notify.mobile_app
    data:
      title: "⚠️ 安全警报"
      message: "离家模式下检测到有人活动！"
      data:
        image: "/local/snapshots/intrusion_{{ now().strftime('%Y%m%d_%H%M%S') }}.jpg"
        push:
          sound:
            name: default
            critical: 1
            volume: 1.0
  - service: tts.speak
    target:
      entity_id: tts.piper
    data:
      media_player_entity_id: media_player.all_speakers
      message: "警告！检测到异常入侵，已通知房主并录像取证。"
mode: single
```

---

## 十二、洗衣机/洗碗机完成通知

```yaml
alias: "洗衣机完成通知"
description: "功率降到5W以下视为洗完"
trigger:
  - platform: numeric_state
    entity_id: sensor.plug_washing_machine_power
    below: 5
    for: "00:03:00"
condition:
  - condition: numeric_state
    entity_id: sensor.plug_washing_machine_power
    above: 0
action:
  - service: tts.speak
    target:
      entity_id: tts.piper
    data:
      media_player_entity_id: media_player.living_room_speaker
      message: "洗衣机已完成洗涤，请记得晾衣服。"
  - service: notify.mobile_app
    data:
      title: "洗衣完成"
      message: "洗衣机已完成，请取出衣物晾晒。"
mode: single
```

---

## 十三、久坐提醒

```yaml
alias: "久坐提醒"
description: "多功能室连续坐90分钟提醒"
trigger:
  - platform: state
    entity_id: binary_sensor.fp2_study_desk_zone
    to: "on"
    for: "01:30:00"
condition:
  - condition: state
    entity_id: input_boolean.work_mode
    state: "on"
action:
  - service: tts.speak
    target:
      entity_id: tts.piper
    data:
      media_player_entity_id: media_player.study_speaker
      message: "你已经连续坐了一个半小时了，建议起来活动一下。"
  - service: light.turn_on
    target:
      entity_id: light.study_strip
    data:
      effect: "breathe"
      brightness_pct: 50
mode: single
```

---

## 十四、低电量预警

```yaml
alias: "低电量设备预警"
description: "每天检查一次电池设备电量"
trigger:
  - platform: time
    at: "09:00:00"
condition:
  - condition: template
    value_template: >
      {{ states.sensor
         | selectattr('attributes.device_class', 'defined')
         | selectattr('attributes.device_class', 'eq', 'battery')
         | selectattr('state', 'lt', '20')
         | list | count > 0 }}
action:
  - service: notify.mobile_app
    data:
      title: "设备电量提醒"
      message: >
        以下设备电量低于20%:
        {% for s in states.sensor
           | selectattr('attributes.device_class', 'defined')
           | selectattr('attributes.device_class', 'eq', 'battery')
           | selectattr('state', 'lt', '20')
           | list %}
        - {{ s.attributes.friendly_name }}: {{ s.state }}%
        {% endfor %}
mode: single
```

---

## 十五、度假模拟在家

```yaml
alias: "度假模拟在家"
description: "随机开关灯模拟有人在家"
trigger:
  - platform: state
    entity_id: input_select.home_mode
    to: "度假"
action:
  - repeat:
      while:
        - condition: state
          entity_id: input_select.home_mode
          state: "度假"
      sequence:
        - service: light.turn_on
          target:
            entity_id: >
              {{ ['light.living_room_group', 'light.master_bedroom_group',
                  'light.hallway_group'] | random }}
          data:
            brightness_pct: "{{ range(30, 80) | random }}"
        - delay:
            minutes: "{{ range(20, 60) | random }}"
        - service: light.turn_off
          target:
            entity_id: all
        - delay:
            minutes: "{{ range(10, 30) | random }}"
mode: single
```

---

## 十六、早间播报

```yaml
alias: "早间播报"
description: "起床后播报天气、日程、空气质量"
trigger:
  - platform: state
    entity_id: binary_sensor.bed_pressure_master
    from: "on"
    to: "off"
condition:
  - condition: time
    after: "06:00:00"
    before: "10:00:00"
  - condition: state
    entity_id: input_boolean.sleep_mode
    state: "on"
action:
  - service: input_boolean.turn_off
    target:
      entity_id: input_boolean.sleep_mode
  - service: cover.open_cover
    target:
      entity_id:
        - cover.master_bedroom_curtain_north
        - cover.master_bedroom_curtain_east
  - service: light.turn_on
    target:
      entity_id: light.master_bedroom_group
    data:
      brightness_pct: 40
      color_temp_kelvin: 4000
  - delay: "00:00:05"
  - service: tts.speak
    target:
      entity_id: tts.piper
    data:
      media_player_entity_id: media_player.bedroom_speaker
      message: >
        早上好！现在是 {{ now().strftime('%H点%M分') }}。
        今天天气 {{ states('weather.home') }}，
        室外温度 {{ state_attr('weather.home', 'temperature') }}度。
        室内温度 {{ states('sensor.living_room_temperature') }}度，
        湿度 {{ states('sensor.living_room_humidity') }}%，
        空气质量CO2 {{ states('sensor.qingping_co2') }}ppm。
mode: single
```

---

## 自动化使用说明

1. 将以上 YAML 复制到 `ha-config/automations.yaml`，或通过 HA UI 创建
2. 所有 `entity_id` 需替换为你实际设备的 ID（在 HA -> 开发者工具 -> 状态 中查看）
3. 红外设备（电视/空调/新风）的 `remote.send_command` 需先在 M3 App 中学习遥控码
4. TTS 语音服务需先部署语音助手，参见 [05-voice-assistant.md](05-voice-assistant.md)
