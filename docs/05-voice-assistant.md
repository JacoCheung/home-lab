# 语音助手部署指南

> 小智 ESP32-S3 + Ollama 本地大模型 + Home Assistant 集成

---

## 架构

```
用户说话
   │
   ▼
ESP32-S3 (INMP441麦克风拾音)
   │ WebSocket / HTTP
   ▼
xiaozhi-esp32-server (Mini PC)
   ├── ASR 语音识别 (Whisper / FunASR)
   ├── LLM 大模型 (Ollama: DeepSeek / Qwen)
   ├── TTS 语音合成 (Piper / edge-tts)
   └── HA API 调用 (控制设备)
   │
   ▼
ESP32-S3 (MAX98357 喇叭播放)
```

---

## 一、硬件准备（每个语音终端）

| 元件 | 数量 | 参考价 | 说明 |
|------|------|--------|------|
| ESP32-S3-DevKitC-1 (N16R8) | 1 | 30元 | 16MB Flash + 8MB PSRAM |
| INMP441 I2S 麦克风 | 1 | 5元 | 数字麦克风，灵敏度高 |
| MAX98357A I2S 功放+喇叭 | 1 | 8元 | 3W 输出，直连 I2S |
| 3D打印外壳（可选） | 1 | 15元 | 淘宝定制或自行打印 |

共 6 套，分别放置在：客厅、主卧、次卧、多功能室、厨房、走廊

### 接线参考

```
ESP32-S3          INMP441
---------         -------
GPIO  4  ───────  WS
GPIO  5  ───────  SCK
GPIO  6  ───────  SD
3V3      ───────  VDD
GND      ───────  GND
         ───────  L/R -> GND (左声道)

ESP32-S3          MAX98357A
---------         ---------
GPIO 15  ───────  BCLK
GPIO 16  ───────  LRC
GPIO 17  ───────  DIN
5V       ───────  VIN
GND      ───────  GND
```

> GPIO 编号仅供参考，以 xiaozhi-esp32 项目默认配置或你的自定义为准

---

## 二、ESP32 固件烧录

### 2.1 安装工具

```bash
pip install esptool
```

### 2.2 获取小智固件

```bash
git clone https://github.com/78/xiaozhi-esp32.git
cd xiaozhi-esp32
```

### 2.3 使用 Arduino IDE 或 PlatformIO 编译

推荐 PlatformIO:

```bash
pip install platformio
pio run -e esp32s3
```

### 2.4 烧录

```bash
esptool.py --port /dev/ttyUSB0 --baud 460800 \
  write_flash 0x0 .pio/build/esp32s3/firmware.bin
```

### 2.5 配置 Wi-Fi

首次启动后 ESP32 会创建热点，手机连接后输入家庭 Wi-Fi 信息。

---

## 三、服务端部署（Mini PC）

### 3.1 部署 Ollama

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型（选一个）
ollama pull qwen2.5:7b      # 中文能力强，推荐
# 或
ollama pull deepseek-r1:7b   # 推理能力强
```

验证:

```bash
ollama run qwen2.5:7b "你好，你是谁？"
```

### 3.2 部署 xiaozhi-esp32-server

```bash
git clone https://github.com/78/xiaozhi-esp32-server.git
cd xiaozhi-esp32-server

# 创建配置
cp config.example.yaml config.yaml
```

编辑 `config.yaml`:

```yaml
server:
  host: 0.0.0.0
  port: 8000

asr:
  engine: funasr  # 或 whisper
  funasr:
    model: paraformer-zh

llm:
  engine: ollama
  ollama:
    base_url: http://localhost:11434
    model: qwen2.5:7b
    system_prompt: |
      你是一个智能家居助手，名字叫小智。你可以控制家里的灯光、窗帘、
      空调、电视等设备。你也可以回答问题、设置备忘录、查询天气。
      请用简洁自然的中文回答。

tts:
  engine: edge-tts  # 微软免费TTS，效果好
  edge_tts:
    voice: zh-CN-XiaoxiaoNeural

homeassistant:
  url: http://localhost:8123
  token: YOUR_LONG_LIVED_ACCESS_TOKEN
```

### 3.3 Docker 部署（推荐）

将以下添加到之前的 `docker-compose.yml`:

```yaml
  xiaozhi-server:
    container_name: xiaozhi-server
    build: ./xiaozhi-esp32-server
    # 或使用预编译镜像（如果有）
    volumes:
      - ./xiaozhi-config:/app/config
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_HOST=http://host.docker.internal:11434
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
```

### 3.4 HA Long-Lived Token 获取

1. HA -> 左下角用户头像 -> 安全 -> 长期访问令牌 -> 创建令牌
2. 复制 token 填入 `config.yaml`

---

## 四、语音控制 Home Assistant

### 4.1 Function Calling 方式

在 `config.yaml` 中定义可调用的 HA 服务:

```yaml
functions:
  - name: turn_on_light
    description: "打开灯"
    parameters:
      room:
        type: string
        description: "房间名称"
        enum: ["客厅", "主卧", "次卧", "多功能室", "厨房", "走廊", "玄关"]
    action:
      service: light.turn_on
      target:
        entity_id: "light.{{ room }}_group"
      data:
        brightness_pct: 80

  - name: turn_off_light
    description: "关灯"
    parameters:
      room:
        type: string
        enum: ["客厅", "主卧", "次卧", "多功能室", "厨房", "走廊", "玄关", "全部"]
    action:
      service: light.turn_off
      target:
        entity_id: >
          {% if room == '全部' %}all{% else %}light.{{ room }}_group{% endif %}

  - name: control_curtain
    description: "控制窗帘"
    parameters:
      room:
        type: string
      action:
        type: string
        enum: ["open", "close", "stop"]
    action:
      service: "cover.{{ action }}_cover"
      target:
        entity_id: "cover.{{ room }}_curtains"

  - name: set_ac_temperature
    description: "设置空调温度"
    parameters:
      temperature:
        type: number
    action:
      service: climate.set_temperature
      target:
        entity_id: climate.central_ac
      data:
        temperature: "{{ temperature }}"

  - name: switch_mode
    description: "切换家庭模式"
    parameters:
      mode:
        type: string
        enum: ["睡眠", "观影", "聚会", "工作", "休息"]
    action:
      service: input_boolean.turn_on
      target:
        entity_id: >
          {% if mode == '睡眠' %}input_boolean.sleep_mode
          {% elif mode == '观影' %}input_boolean.movie_mode
          {% elif mode == '聚会' %}input_boolean.party_mode
          {% elif mode == '工作' %}input_boolean.work_mode
          {% elif mode == '休息' %}input_boolean.study_sleep_mode
          {% endif %}

  - name: query_environment
    description: "查询环境数据（温度、湿度、空气质量）"
    parameters:
      metric:
        type: string
        enum: ["temperature", "humidity", "co2", "pm25"]
    action:
      type: query
      entity_id: >
        {% if metric == 'temperature' %}sensor.living_room_temperature
        {% elif metric == 'humidity' %}sensor.living_room_humidity
        {% elif metric == 'co2' %}sensor.qingping_co2
        {% elif metric == 'pm25' %}sensor.qingping_pm25
        {% endif %}

  - name: add_memo
    description: "添加备忘录"
    parameters:
      content:
        type: string
        description: "备忘录内容"
    action:
      type: memo
      storage: "/config/memos/"
```

### 4.2 示例语音交互

| 你说 | 小智回应 |
|------|----------|
| "小智，打开客厅灯" | "好的，客厅灯已打开" |
| "把空调调到24度" | "已将空调设置为24度" |
| "现在温度多少" | "室内温度25.3度，湿度58%" |
| "切换到观影模式" | "已切换到观影模式，灯光已调暗，窗帘已合上" |
| "帮我记一下，明天下午3点开会" | "已记录：明天下午3点开会" |
| "多功能室切换到睡眠模式" | "好的，多功能室已切换到睡眠模式，灯光调暗，床帘已放下" |

---

## 五、备忘录与对话记忆

### 5.1 对话历史持久化

在 `config.yaml` 中配置:

```yaml
memory:
  enabled: true
  backend: sqlite
  db_path: /config/chat_history.db
  max_history: 50
  
  # 用户画像记忆（长期记忆）
  user_profile:
    enabled: true
    summary_interval: 100  # 每100轮对话总结一次用户偏好
```

### 5.2 备忘录存储

```yaml
memo:
  storage_path: /config/memos/
  format: json
  
  # 支持查询
  query_commands:
    - "查看备忘录"
    - "我有什么待办"
    - "提醒我什么"
```

备忘录会以 JSON 格式存储，支持语音查询和自动到期提醒。

---

## 六、与小爱同学共存

两种方案并行使用：

1. **小爱音箱**: 放在客厅，处理简单指令和音乐播放（"小爱同学"唤醒）
2. **小智ESP32**: 放在每个房间，处理复杂对话和 HA 深度控制（"小智"唤醒）

两者不冲突，唤醒词不同，各管各的。

---

## 七、后续优化

- **唤醒词自定义**: 修改小智固件中的唤醒词模型
- **声纹识别**: 区分家庭成员，提供个性化服务
- **多语言**: Ollama 模型天然支持多语言
- **离线ASR**: FunASR paraformer 模型完全离线运行
- **升级模型**: 硬件升级后可切换更大模型（如 qwen2.5:14b）
