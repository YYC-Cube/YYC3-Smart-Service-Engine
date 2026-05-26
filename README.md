# YYC³ Smart Service Engine (YYC³-SSE)

> ***YanYuCloudCube - Intelligent Service Engine***
> *言启象限 | 语枢未来 | 智能服务*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*

[![YYC³ Standard](https://img.shields.io/badge/YYC³-Five_High_Standard-blue)](./docs/00-项目现状审核报告.md)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-green)](package.json)

## 📖 项目简介

YYC³ Smart Service Engine (YYC³-SSE) 是一个基于 **五高五标五化五维** 标准体系构建的 **AI 驱动智能服务平台**。项目采用现代化技术栈（Next.js 14 + React 19 + TypeScript），集成多项 AI 核心能力：

- 🤖 **智能数字人助手** - 24/7 AI 对话与多轮上下文管理
- 👤 **状态机引擎** - idle/listening/thinking/speaking 四态智能转换
- 🎨 **增强文生图系统** - 进度显示、批量生成、Prompt模板
- 🎤 **流式TTS语音** - 文本分块、队列管理、实时语音合成
- 🧠 **对话式AI** - 意图识别、实体提取、情感分析

## ✨ 核心特性

### 五高架构 (Five-High Architecture)

- **高可用性** (High Availability) - 云原生架构，弹性扩展
- **高性能** (High Performance) - Next.js SSR/SSG 优化
- **高安全性** (High Security) - 企业级安全防护
- **高扩展性** (High Scalability) - 模块化设计，微服务就绪
- **高智能** (High Intelligence) - AI 驱动的智能决策

### 五标体系 (Five-Standard System)

- ✅ **标准化** - 统一的代码规范和组件库（shadcn/ui）
- ✅ **规范化** - ESLint + Prettier + Husky 自动化工具链
- ✅ **自动化** - CI/CD 流水线 + 测试覆盖率 >80%
- ✅ **可视化** - 完整的文档体系和监控面板
- ✅ **智能化** - 自优化、自监控、自愈能力

## 🚀 快速开始

### 前置要求

- **Node.js**: >= 18.x
- **pnpm**: >= 8.x (推荐包管理器)
- **Git**: 最新版本

### 安装步骤

```bash
# 克隆仓库
git clone <repository-url>
cd my-v0-project

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 在浏览器中打开 http://localhost:3000
```

### 可用脚本

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 (<http://localhost:3000>) |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm lint:fix` | 自动修复 ESLint 错误 |
| `pnpm format` | 使用 Prettier 格式化代码 |
| `pnpm format:check` | 检查代码格式是否符合规范 |
| `pnpm test` | 运行测试（监听模式） |
| `pnpm test:run` | 运行所有测试一次 |
| `pnpm test:coverage` | 运行测试并生成覆盖率报告 |
| `pnpm typecheck` | TypeScript 类型检查 |

## 📁 项目结构

```
my-v0-project/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   └── globals.css              # 全局样式
├── components/
│   ├── ui/                      # shadcn/ui 基础组件库 (50+ 组件)
│   ├── enhanced-image-generator.tsx    # 增强图片生成
│   ├── enhanced-voice-interface.tsx    # 增强语音接口
│   └── theme-provider.tsx             # 主题提供者
├── customer-service/            # 智能客服模块
├── intelligent-customer-operations/  # 智能客服运营
├── sofa-digital-human/          # 数字人核心模块
├── text-to-image/               # AI 文生图模块
├── hooks/                       # 自定义 React Hooks
│   ├── useAIContext.ts          # AI 上下文管理
│   ├── useTextToSpeech.ts       # TTS 语音合成
│   ├── useVoiceRecognition.ts   # ASR 语音识别
│   ├── use-mobile.tsx           # 移动端检测
│   └── use-toast.ts             # Toast 通知
├── lib/                         # 工具函数
│   └── utils.ts                 # cn() 工具函数
├── tests/                       # 测试文件
│   ├── setup.ts                 # 测试配置
│   ├── hooks/                   # Hook 测试
│   └── lib/                     # 工具函数测试
├── docs/                        # YYC³ 文档体系
│   ├── 00-项目现状审核报告.md
│   ├── 01-任务规划与节点目标.md
│   └── ...                      # 十阶段完整文档
├── public/                      # 静态资源
├── .husky/                      # Git hooks
├── .eslintrc.json               # ESLint 配置
├── .prettierrc                  # Prettier 配置
├── commitlint.config.js         # Commitlint 配置
├── vitest.config.ts             # Vitest 测试配置
├── tailwind.config.js           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目依赖
```

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Next.js | 14.2.25 | 全栈 React 框架 (App Router) |
| **UI 库** | React | ^19 | 用户界面库 |
| **语言** | TypeScript | 5.7.3 | 类型安全的 JavaScript 超集 |
| **样式** | Tailwind CSS | ^3.4.17 | 原子化 CSS 工具类框架 |
| **组件库** | shadcn/ui + Radix UI | Latest | 无障碍 UI 组件 |
| **图表** | Recharts | 2.15.0 | 数据可视化 |
| **图标** | Lucide React | ^0.454.0 | 图标库 |
| **测试** | Vitest | ^4.1 | 单元测试框架 |
| **Linting** | ESLint + Prettier | Latest | 代码质量保障 |
| **Git Hooks** | Husky + lint-staged | Latest | Git 工作流自动化 |

## 🧪 测试

项目使用 **Vitest** 作为主要测试框架，配合 **@testing-library/react** 进行组件测试。

```bash
# 运行所有测试
pnpm test:run

# 运行测试并查看覆盖率
pnpm test:coverage

# 监听模式运行测试
pnpm test
```

当前测试覆盖情况：

- ✅ **lib/utils.ts** - 100% 覆盖率 (6 个测试用例)
- ✅ **hooks/useAIContext.ts** - 核心功能测试 (8 个测试用例)
- ✅ **hooks/use-mobile.tsx** - 移动端检测测试 (2 个测试用例)

**目标**: Q2 末达到 60%+ 整体覆盖率，Q3 末达到 80%+。

## 📚 文档体系

项目遵循 **YYC³ 文档闭环标准**，完整的文档体系位于 [docs/](docs/) 目录：

- [📊 项目现状审核报告](docs/00-项目现状审核报告.md) - 五维评估深度分析
- [📋 任务规划与节点目标](docs/01-任务规划与节点目标.md) - 四阶段十里程碑实施路线图
- [🏗️ 项目总览手册](docs/00-YYC3-API-Mana-项目总览索引/001-AI-Family-项目总览索引-项目总览手册.md) - 技术架构全景

详细标准规范请参考：

- [YYC³ 开发文档](./YYC3-团队通用-标准规范/YYC3-团队通用-开发文档.md)
- [团队开发标准](./YYC3-团队通用-标准规范/YYC3-团队规范-开发标准.md)
- [文档闭环建设标准](./YYC3-团队通用-标准规范/YYC3-团队规范-文档闭环.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献流程。

### Commit Message 规范

项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链变更
- `perf`: 性能优化

**示例**:

```bash
feat(customer-service): add smart-dialog flow management
fix(hooks): resolve useAIContext race condition in concurrent calls
test(components): add Button component unit tests with 100% coverage
docs(readme): update installation guide with pnpm instructions
```

## 📜 行为准则

参与本项目即表示您同意遵守 [行为准则](CODE_OF_CONDUCT.md)。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
>
> **© 2025-2026 YYC³ Team. All Rights Reserved.**
>
> **Built with ❤️ using Next.js + React + TypeScript**

</div>
