const PRODUCTS = {
  "m3-hub": {
    name: "M3 方舟智慧中枢",
    model: "HE-P60",
    price: 989,
    image: "images/products/m3-hub.jpg",
    protocol: "Zigbee 3.0 / Thread / BLE 5.1 / IR / Wi-Fi / Ethernet",
    buyUrl: "https://item.jd.com/10094955670411.html",
    buyLabel: "京东旗舰店",
    features: [
      "全协议中枢，一台打通 Zigbee / Thread / Matter 设备",
      "360° 内置红外，遥控空调、电视、新风等传统家电",
      "8GB 本地存储，自动化配置和日志本地保存",
      "支持 PoE 供电（48V）或 USB-C（5V）",
      "集中-分布式架构，支持跨网关本地自动化",
      "兼容 Apple HomeKit / Alexa / Google Home / 米家"
    ],
    specs: {
      "尺寸": "105 × 105 × 36.5 mm",
      "重量": "200g",
      "供电": "USB-C 5V/2A 或 PoE 48V",
      "Wi-Fi": "双频 2.4/5 GHz 802.11ac",
      "最大设备数": "128 台 Zigbee/Thread",
      "工作温度": "-10°C ~ 50°C"
    },
    install: "放置在客厅电视柜或弱电箱附近，用网线连接路由器（推荐有线）。IR 遥控面对准空调/电视方向放置，避免放在金属柜子里。"
  },
  "m2-gateway": {
    name: "M2 智能网关",
    model: "HM2-G01",
    price: 399,
    protocol: "Zigbee 3.0 / Wi-Fi / BLE / IR",
    buyUrl: "https://item.jd.com/10020347605639.html",
    buyLabel: "京东旗舰店",
    features: [
      "支持 Zigbee 子设备接入",
      "内置红外发射器，控制红外家电",
      "可做厨房区域 IR 补充覆盖",
      "兼容 Apple HomeKit / Alexa"
    ],
    specs: {
      "尺寸": "73 × 73 × 25 mm",
      "供电": "USB-C 5V/1A",
      "Wi-Fi": "2.4 GHz",
      "最大设备数": "128 台",
      "IR 覆盖": "360° / 8m"
    },
    install: "放在厨房区域用于红外遥控补充覆盖，或作为 M3 的备用网关。"
  },
  "h1pro-single": {
    name: "H1 Pro 零火单键",
    model: "QBKG38LM",
    price: 149,
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10026305049589.html",
    buyLabel: "京东旗舰店",
    features: [
      "零火线接入，信号稳定",
      "单路通断控制",
      "支持物理按键+App+语音控制",
      "OTA 固件升级",
      "LED 状态指示灯（可关闭）"
    ],
    specs: {
      "尺寸": "86 × 86 × 37.5 mm",
      "额定负载": "10A / 2200W",
      "接线": "火线(L) + 零线(N) + 灯线(L1)",
      "工作温度": "-10°C ~ 50°C"
    },
    install: "关闭对应回路断路器→拆下原面板→火线接L、零线接N、灯线接L1→装入底盒→合闸→Aqara App扫码配对。安装位置：玄关、走廊、主卫、客卫。"
  },
  "h1pro-double": {
    name: "H1 Pro 零火双键",
    model: "QBKG39LM",
    price: 179,
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10026305049589.html",
    buyLabel: "京东旗舰店",
    features: [
      "零火线接入，双路独立通断",
      "一个面板控制两组灯",
      "支持物理按键+App+语音控制",
      "LED 状态指示灯（可关闭）"
    ],
    specs: {
      "尺寸": "86 × 86 × 37.5 mm",
      "额定负载": "每路 10A / 总 20A",
      "接线": "L + N + L1 + L2",
      "工作温度": "-10°C ~ 50°C"
    },
    install: "同单键安装方式，灯线分别接 L1、L2。安装位置：主卧、次卧、多功能室、厨房各一个。"
  },
  "h1pro-triple": {
    name: "H1 Pro 零火三键",
    model: "QBKG40LM",
    price: 209,
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10026305049589.html",
    buyLabel: "京东旗舰店",
    features: [
      "零火线接入，三路独立通断",
      "一个面板控制三组灯",
      "适合客厅等多灯区域"
    ],
    specs: {
      "尺寸": "86 × 86 × 37.5 mm",
      "额定负载": "每路 10A",
      "接线": "L + N + L1 + L2 + L3"
    },
    install: "安装于客厅，三路分别控制：主灯组、辅灯组、灯带。"
  },
  "wireless-h1": {
    name: "无线开关 H1 双键",
    model: "WRS-R02",
    price: 99,
    image: "images/products/wireless-switch-h1.png",
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/Wireless-Remote-Switch-H1_overview",
    buyLabel: "Aqara 官网",
    features: [
      "免布线，3M 胶粘贴即可",
      "双键，支持单击/双击/长按",
      "CR2450 纽扣电池，续航约5年",
      "可绑定灯光/窗帘/场景"
    ],
    specs: {
      "尺寸": "85.8 × 86 × 12.5 mm",
      "电池": "CR2450 × 1",
      "续航": "约5年"
    },
    install: "3M 胶粘在床头、沙发旁、门口等位置。配对后在 App 绑定控制对象。安装于主卧/次卧/多功能室床头。"
  },
  "knob-h1": {
    name: "旋钮开关 H1",
    model: "ZNXNKG02LM",
    price: 149,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/wireless-smart-knob-h1_overview",
    buyLabel: "Aqara 官网",
    features: [
      "旋转调节灯光亮度",
      "按压切换开关状态",
      "免布线，可放桌面或磁吸",
      "CR2032 纽扣电池"
    ],
    specs: {
      "尺寸": "45 × 45 × 43 mm",
      "电池": "CR2032 × 1",
      "操作": "旋转+按压"
    },
    install: "放在客厅沙发旁茶几上，旋转即调光。在 App 中绑定客厅灯组。"
  },
  "s1e-panel": {
    name: "妙控开关 S1E",
    model: "ZNQJKMK11LM",
    price: 239,
    protocol: "Zigbee / Wi-Fi",
    buyUrl: "https://www.aqara.cn/Smart-Magic-Switch-S1E_overview",
    buyLabel: "Aqara 官网",
    features: [
      "4 寸触摸屏，可视化场景面板",
      "一键切换到家/离家/睡眠等模式",
      "支持添加快捷设备控制",
      "替换普通开关底盒安装",
      "兼容 HomeKit 场景"
    ],
    specs: {
      "屏幕": "4寸 480×480 IPS 触控",
      "尺寸": "86 × 86 × 37 mm",
      "接线": "L + N（零火线）",
      "处理器": "双核 ARM"
    },
    install: "替换现有墙面开关位，接零火线。建议安装在客厅入口和主卧床头，方便一键切换场景。"
  },
  "spotlight-t2": {
    name: "筒射灯 T2 (10W)",
    model: "ZNLDP13LM",
    price: 299,
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10088418622372.html",
    buyLabel: "京东旗舰店",
    features: [
      "10W 高亮，适合客厅等大空间",
      "色温 2700-6000K 无级调节",
      "CRI ≥ 90 高显色",
      "十万分级调光，支持 Adaptive Lighting",
      "光束角 15°/24°/36°/60° 可选"
    ],
    specs: {
      "功率": "10W",
      "色温": "2700K ~ 6000K",
      "显色指数": "≥ Ra90",
      "开孔": "Φ75mm",
      "寿命": "25000 小时",
      "光束角": "15°/24°/36°/60°"
    },
    install: "替换吊顶原有筒灯，标准 75mm 开孔。如开孔不匹配需购买转换环。用于客厅和多功能室。"
  },
  "spotlight-t3": {
    name: "筒射灯 T3 (6W)",
    model: "ZNLDP14LM",
    price: 199,
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10074788583576.html",
    buyLabel: "京东旗舰店",
    features: [
      "6W 适中亮度，卧室/走廊首选",
      "色温 2700-6000K 无级调节",
      "CRI ≥ 90 高显色",
      "光束角 15°/24°/36°/80° 可选"
    ],
    specs: {
      "功率": "6W",
      "色温": "2700K ~ 6000K",
      "显色指数": "≥ Ra90",
      "开孔": "Φ75mm",
      "寿命": "25000 小时"
    },
    install: "用于玄关、走廊、主卧、次卧。安装方式同 T2。"
  },
  "led-strip": {
    name: "流光溢彩灯带 T1 (2m)",
    model: "LGYCDD01LM",
    price: 299,
    image: "images/products/led-strip-t1.png",
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10076414859709.html",
    buyLabel: "京东旗舰店",
    features: [
      "RGBCW 1600万色无极调节",
      "色温 2700-6500K",
      "每米90颗灯珠，显色均匀",
      "可延长至10米（需购买延长灯带）",
      "音乐律动模式，多种灯光效果"
    ],
    specs: {
      "长度": "2m（标配）",
      "灯珠": "90颗/米",
      "色温": "2700K ~ 6500K + RGB",
      "功率": "5W/米",
      "供电": "24V DC"
    },
    install: "安装在吊顶灯槽内或床底。3M背胶粘贴。标配包含驱动控制器。需配合 Zigbee 网关使用。"
  },
  "dimmer-t1": {
    name: "调光模块 T1",
    model: "ZNTGMK12LM",
    price: 189,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/Intelligent-dimming-module-T1-(0%EF%BD%9E10V)_overview",
    buyLabel: "Aqara 官网",
    features: [
      "0-10V 调光输出",
      "控制第三方灯带或灯具驱动",
      "可安装在吊顶内或开关底盒内",
      "App/语音/自动化控制亮度"
    ],
    specs: {
      "输出": "0-10V DC",
      "输入": "220V AC",
      "尺寸": "50 × 50 × 25 mm"
    },
    install: "安装在吊顶内或开关底盒内。接线：220V 输入 → 调光模块 → 灯带驱动 → LED灯带。"
  },
  "curtain-c3": {
    name: "窗帘电机 C3",
    model: "ZNCLDJ01LM",
    price: 1319,
    image: "images/products/curtain-e1.png",
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10076413459323.html",
    buyLabel: "京东旗舰店",
    features: [
      "航空铝合金机身，26dB 超静音",
      "2N·m 大扭力，承重 80kg",
      "无极调速，0-100% 开合控制",
      "手拉即停/断电手拉功能",
      "App/语音/定时/自动化控制"
    ],
    specs: {
      "噪音": "26dB",
      "扭矩": "2.0 N·m",
      "功率": "14.2W",
      "供电": "100-240V AC",
      "尺寸": "315 × 50 × 50 mm"
    },
    install: "①确认窗帘盒内有电源 ②安装定制轨道 ③电机挂在轨道一端 ④插电配对 ⑤手动拉到两端标定行程。建议购买京东/天猫 电机+轨道+安装 套装。"
  },
  "lock-d200": {
    name: "D200 人脸识别门锁",
    model: "ZNMS24LM",
    price: 3979,
    image: "images/products/smart-lock-u200.jpg",
    protocol: "Zigbee / BLE",
    buyUrl: "https://item.jd.com/10064198654768.html",
    buyLabel: "京东旗舰店",
    features: [
      "3D 结构光人脸识别，0.3秒解锁",
      "指纹/密码/NFC/钥匙 多种开锁方式",
      "内置猫眼摄像头（Cat-Eye）",
      "联动灯光/窗帘等到家场景",
      "远程一次性密码（临时访客）",
      "防撬/防尾随/暴力破解告警"
    ],
    specs: {
      "面板材质": "铝合金",
      "门厚": "40-120mm",
      "电池": "锂电池可充电",
      "续航": "约6个月",
      "工作温度": "-25°C ~ 55°C"
    },
    install: "需专业锁匠安装。购买时可预约 Aqara 上门安装服务。安装后在 App 中录入人脸、指纹、密码。"
  },
  "doorbell-g4": {
    name: "G4 智能可视门铃",
    model: "ZNMS17LM",
    price: 699,
    protocol: "Wi-Fi 2.4GHz",
    buyUrl: "https://www.aqara.cn/Smart-Video-Doorbell-G4_overview",
    buyLabel: "Aqara 官网",
    features: [
      "1080p / 162° 超广角",
      "AI 人脸识别，区分家人/访客",
      "双向对讲，支持变声",
      "本地存储（MicroSD 最大512GB）",
      "IP66 防水等级",
      "含室内门铃+Wi-Fi 中继器"
    ],
    specs: {
      "分辨率": "1080p",
      "视角": "162°",
      "电池": "6节AA / 有线12-24V",
      "续航": "约4个月（电池模式）",
      "存储": "MicroSD / 7天免费云存储"
    },
    install: "安装在入户门外侧，门框旁1.3-1.5m高度。3M 胶粘或螺丝固定底座。新款 G410（2K+175°+毫米波+Zigbee/Thread网关）已上市，推荐优先考虑。"
  },
  "camera-g3": {
    name: "G3 摄像机网关版",
    model: "CH-H03",
    price: 699,
    image: "images/products/camera-g3.png",
    protocol: "Wi-Fi / Zigbee",
    buyUrl: "https://www.aqara.cn/Camera-Hub-G3_overview",
    buyLabel: "Aqara 官网",
    features: [
      "2K 超清画质",
      "360° 全景旋转扫描",
      "AI 人体/手势识别",
      "红外夜视",
      "内置 Zigbee 网关功能",
      "本地存储 + RTSP 支持",
      "可接入 Home Assistant + go2rtc"
    ],
    specs: {
      "分辨率": "2304 × 1296",
      "视角": "146°",
      "夜视": "红外 940nm",
      "存储": "MicroSD 最大256GB"
    },
    install: "放在客厅高处，对准入户门方向。USB-C 供电，需附近有插座。可放电视柜高处或吊顶下方。"
  },
  "fp2-sensor": {
    name: "FP2 人体存在传感器",
    model: "RTCZCGQ12LM",
    price: 499,
    image: "images/products/fp2-sensor.png",
    protocol: "Wi-Fi / BLE",
    buyUrl: "https://www.aqara.cn/Presence-Sensor-FP2_overview",
    buyLabel: "Aqara 官网",
    features: [
      "mmWave 毫米波雷达，检测静止人体",
      "支持区域定位（最多30个区域）",
      "最多检测5人同时存在",
      "内置光照传感器",
      "无需网关，Wi-Fi 直连",
      "IPX5 防水，可用于卫生间"
    ],
    specs: {
      "检测距离": "最远 5m",
      "检测面积": "最大 40㎡",
      "供电": "USB-C 5V/1A",
      "尺寸": "64 × 64 × 29.5 mm"
    },
    install: "3M胶粘在天花板（推荐）或墙面。在 App 中划分检测区域。分别安装在：玄关、客厅、主卧、多功能室。新款 FP300（PIR+mmWave+温湿度+光照多合一）已推出，如预算允许可替代。"
  },
  "p2-sensor": {
    name: "高精度人体传感器",
    model: "RTCGQ13LM",
    price: 199,
    image: "images/products/p2-sensor.png",
    protocol: "Zigbee 3.0",
    buyUrl: "https://item.jd.com/10024066313112.html",
    buyLabel: "京东旗舰店",
    features: [
      "高精度 PIR 传感，静坐可检测",
      "内置光照传感器",
      "CR2450 电池续航约2年",
      "60°锥形检测范围，5m距离"
    ],
    specs: {
      "检测距离": "最远 5m",
      "检测角度": "60° 锥形",
      "电池": "CR2450",
      "尺寸": "74 × 74 × 43.3 mm"
    },
    install: "安装在走廊墙面/门框上方或天花板。用于走廊、主卫、客卫、次卧。人来亮灯、人走关灯。"
  },
  "temp-e1": {
    name: "温湿度传感器 T1",
    model: "WSDCGQ12LM",
    price: 59,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/d20_overview",
    buyLabel: "Aqara 官网",
    features: [
      "温度/湿度/气压三合一",
      "CR2032 电池续航约2年",
      "精度 ±0.3°C / ±3% RH",
      "体积极小"
    ],
    specs: {
      "温度范围": "-20°C ~ 60°C",
      "湿度范围": "0 ~ 100% RH",
      "电池": "CR2032",
      "尺寸": "25 × 25 × 9 mm"
    },
    install: "3M胶粘在墙面1.5m高度。分别安装在客厅、主卧、次卧、多功能室。"
  },
  "door-sensor-e1": {
    name: "门窗传感器 E1",
    model: "MCCGQ14LM",
    price: 59,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/Door-and-Window-Sensor-E1_overview",
    buyLabel: "Aqara 官网",
    features: [
      "磁铁式门窗开合检测",
      "开/关两种状态",
      "可用于门锁状态双保险",
      "CR1632 电池续航约2年"
    ],
    specs: {
      "检测距离": "22mm 以内",
      "电池": "CR1632",
      "尺寸": "主体 31 × 17 × 8 mm"
    },
    install: "3M胶粘在入户门框顶部，磁铁贴在门上。与 D200 门锁互为备份。"
  },
  "water-leak-t1": {
    name: "水浸传感器 T1",
    model: "SJCGQ12LM",
    price: 99,
    image: "images/products/water-leak-t1.jpg",
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/Water-Leak-Sensor-T1_overview",
    buyLabel: "Aqara 官网",
    features: [
      "IP67 防水等级",
      "漏水即时推送告警",
      "可联动关闭水阀（需配水阀控制器）",
      "CR2032 电池续航约3年"
    ],
    specs: {
      "防水": "IP67",
      "电池": "CR2032",
      "尺寸": "50 × 50 × 15 mm"
    },
    install: "直接放在洗手台下方地面、洗衣机旁等可能漏水位置。分别放在主卫、客卫、厨房。"
  },
  "gas-alarm": {
    name: "天然气报警器",
    model: "JT-BZ-01AQ/A",
    price: 199,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/Aqara%20Smart%20Natural%20Gas%20Detector_overview",
    buyLabel: "Aqara 官网",
    features: [
      "天然气(甲烷)泄漏检测",
      "声光报警 + App 推送",
      "可联动关闭燃气阀门",
      "220V 供电"
    ],
    specs: {
      "检测气体": "CH4（天然气）",
      "报警浓度": "≤ 5% LEL",
      "供电": "220V AC",
      "寿命": "5年"
    },
    install: "安装在燃气灶上方墙面，距天花板约30cm，螺丝固定。220V 供电需就近有插座。"
  },
  "smoke-alarm": {
    name: "烟雾报警器",
    model: "JY-GZ-01AQ",
    price: 239,
    protocol: "NB-IoT / Zigbee",
    buyUrl: "https://www.aqara.cn/Aqara%20Smoke%20Detector_overview",
    buyLabel: "Aqara 官网",
    features: [
      "光电式烟雾检测",
      "独立声光报警 + 联网推送",
      "NB-IoT 独立联网，断电仍可报警",
      "内置锂电池约5年"
    ],
    specs: {
      "检测方式": "光电式",
      "报警声压": "≥ 80dB",
      "电池": "内置锂电池",
      "寿命": "约5年"
    },
    install: "螺丝固定在厨房天花板中央。NB-IoT 无需网关即可联网报警。"
  },
  "smart-plug-t1": {
    name: "智能插座 T1 计量版",
    model: "ZNCZ15LM",
    price: 149,
    image: "images/products/smart-plug.jpg",
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/smart_plug_overview",
    buyLabel: "Aqara 官网",
    features: [
      "10A 通断控制",
      "实时功率/电量计量(W/kWh)",
      "定时开关",
      "可检测洗衣机/洗碗机完成状态（功率<5W）",
      "过载保护"
    ],
    specs: {
      "额定功率": "10A / 2200W",
      "计量精度": "±1%",
      "尺寸": "57 × 40 × 31 mm"
    },
    install: "直接插在墙壁插座上，再把电器插头插入。用于：电视、路由器、油烟机、洗碗机、洗衣机、电脑等。"
  },
  "drying-rack": {
    name: "智能晾衣机 H1",
    model: "ZNLYJ11LM",
    price: 1699,
    protocol: "Wi-Fi / BLE",
    buyUrl: "https://www.aqara.cn/smart-clothes-drying-rack-H1_overview",
    buyLabel: "Aqara 官网",
    features: [
      "电动升降，可自定义高度",
      "内置 LED 照明",
      "暖风+自然风双模式干衣",
      "双贯流风机，遇阻即停保护",
      "App/语音控制，支持 HomeKit/米家"
    ],
    specs: {
      "承重": "35kg",
      "升降距离": "最大 1.3m",
      "晾杆长度": "2.2m / 26个晾衣孔",
      "供电": "220V AC",
      "功率": "≤770W"
    },
    install: "安装在阳台晾衣区天花板。需预留220V电源。螺丝固定顶部支架，Aqara 提供全国200+城市免费上门安装服务。"
  },
  "cube-t1pro": {
    name: "魔方控制器 T1 Pro",
    model: "CTP-R01",
    price: 199,
    protocol: "Zigbee 3.0",
    buyUrl: "https://www.aqara.cn/aqara_qube_t1_pro_overview",
    buyLabel: "Aqara 官网",
    features: [
      "六面手势识别",
      "翻转/摇晃/旋转/推/敲击",
      "每个面可绑定不同场景",
      "趣味性控制方式"
    ],
    specs: {
      "尺寸": "45 × 45 × 45 mm",
      "电池": "CR2450",
      "续航": "约2年"
    },
    install: "无需安装，配对后放在桌面即可使用。旋转=调光、翻转=切换场景、摇晃=随机音乐。"
  }
};

function openProductDrawer(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  const drawer = document.getElementById('product-drawer');
  if (!drawer) return;

  drawer.querySelector('.drawer-product-name').textContent = product.name;
  drawer.querySelector('.drawer-product-model').textContent = product.model;
  drawer.querySelector('.drawer-product-price').textContent = '¥' + product.price;
  drawer.querySelector('.drawer-product-protocol').textContent = product.protocol;

  const imgEl = drawer.querySelector('.drawer-product-img');
  if (product.image) {
    imgEl.src = product.image;
    imgEl.style.display = 'block';
    drawer.querySelector('.drawer-placeholder').style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    drawer.querySelector('.drawer-placeholder').style.display = 'flex';
  }

  const featList = drawer.querySelector('.drawer-features');
  featList.innerHTML = product.features.map(f => '<li>' + f + '</li>').join('');

  const specsTbody = drawer.querySelector('.drawer-specs');
  specsTbody.innerHTML = product.specs
    ? Object.entries(product.specs).map(([k, v]) => '<tr><td>' + k + '</td><td>' + v + '</td></tr>').join('')
    : '';

  drawer.querySelector('.drawer-install').textContent = product.install || '';

  const buyBtn = drawer.querySelector('.drawer-buy-btn');
  buyBtn.href = product.buyUrl || '#';
  buyBtn.textContent = product.buyLabel ? ('去 ' + product.buyLabel + ' 购买') : '查看购买渠道';

  drawer.classList.add('open');
  document.querySelector('.drawer-overlay').classList.add('open');
}

function closeProductDrawer() {
  const drawer = document.getElementById('product-drawer');
  if (drawer) drawer.classList.remove('open');
  document.querySelector('.drawer-overlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-id]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openProductDrawer(el.dataset.productId);
    });
  });

  const overlay = document.querySelector('.drawer-overlay');
  if (overlay) overlay.addEventListener('click', closeProductDrawer);

  const closeBtn = document.querySelector('.drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeProductDrawer);

  const hash = location.hash.replace('#', '');
  if (hash && PRODUCTS[hash]) {
    setTimeout(() => openProductDrawer(hash), 300);
  }
});
