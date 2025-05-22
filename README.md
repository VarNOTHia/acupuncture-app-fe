# Acupuncture App Frontend

## 描述
一个全栈的治疗软件。

## 开始

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
pnpm install
```

### 🔧 环境变量配置

请复制项目根目录下的 `.env.example` 为 `.env` 文件，并填写你自己的配置：

```bash
cp .env.example .env
```

本项目使用了高德地图 API，若有需要请自行申请。

### 治疗方案配置导入

治疗方案依托 MongoDB，在 MongoDB 添加文档即可实现不同治疗方案的实时更新。

治疗方案 be like：
```JSON
{
  "name": "耳鼻喉科",
  "symptoms": [
    {
      "name": "鼻塞",
      "description": "鼻腔内黏膜肿胀，导致鼻腔通气不畅。",
      "line": "手太阴肺经"
    },
    {
      "name": "耳鸣",
      "description": "出现耳鸣、听力下降等症状",
      "line": "手太阳小肠经"
    }
  ]
}
```

### Development
```bash
# Start development server
pnpm dev
```
