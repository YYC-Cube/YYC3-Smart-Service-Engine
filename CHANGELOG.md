# Changelog

All notable changes to **YYC³ Smart Service Engine** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-24

### 🎉 Major Release - YYC³ Smart Service Engine

#### Added
- ✨ **项目品牌升级** - 从 YYC³ AI Bot 升级为 YYC³ Smart Service Engine (YYC³-SSE)
- 🤖 **数字人状态机** - idle/listening/thinking/speaking 四态智能转换引擎
- 🎨 **增强文生图系统** - 进度显示、批量生成、Prompt模板管理
- 🎤 **流式TTS语音** - 文本分块、队列管理、实时语音合成
- 🧠 **对话式AI上下文** - 多轮对话、意图识别、实体提取、情感分析
- 📊 **测试覆盖率提升** - 319个测试用例，87.52%行覆盖率，81.73%函数覆盖率
- 🧪 **新增组件** - EnhancedImageGeneratorV2 增强图像生成器组件

#### Changed
- 🔧 项目名称全面更新（package.json/README/layout/文档）
- 📈 版本号升级至 2.0.0
- 🏷️ 网页标题和元数据优化
- 📝 文档体系更新至新品牌

---

## [Unreleased]

### Added
- YYC³ 标准体系全面落地实施
- DevOps 工具链配置（ESLint + Prettier + Husky + lint-staged）
- Vitest 测试框架搭建及首批 17 个测试用例
- 目录结构整合（移除冗余 ui/ 目录，清理根目录重复文件）
- 完整的文档体系（五件套 + 十阶段 YYC³ 文档）
- Git 工作流规范化（Commitlint + Conventional Commits）
- 项目总览手册和技术架构文档
- 全局深度分析审核报告（五维评估体系）

### Changed
- 升级依赖包至最新稳定版本
- 统一代码风格为单引号、分号结尾
- 优化项目目录结构，消除冗余

### Fixed
- 修复 TypeScript 类型定义不一致问题
- 解决组件路径引用混乱问题

### Documentation
- README.md - 项目主文档（快速开始、技术栈、结构说明）
- CONTRIBUTING.md - 详细贡献指南
- CODE_OF_CONDUCT.md - 社区行为准则
- CHANGELOG.md - 变更日志（本文件）
- LICENSE - MIT 开源许可证
- docs/00-项目现状审核报告.md - 五维评估深度分析
- docs/01-任务规划与节点目标.md - 四阶段十里程碑实施方案

---

## [0.1.0] - 2026-05-23

### Added
- Initial project setup with Next.js 14 + React 19 + TypeScript 5.7
- shadcn/ui component library integration (50+ components)
- Smart Customer Service system (70% complete)
- Digital Human core functionality (60% complete)
- AI Text-to-Image generator (65% complete)
- Voice interaction system (TTS + ASR) (75% complete)
- AI Context management hook (useAIContext)
- Theme system with dark/light mode support
- Basic routing and layout structure

### Technical Stack
- Framework: Next.js 14.2.25 (App Router)
- UI Library: React 19.2.6
- Language: TypeScript 5.7.3 (strict mode)
- Styling: Tailwind CSS 3.4.19
- Components: Radix UI + shadcn/ui
- Charts: Recharts 2.15.0
- Icons: Lucide React 0.454.0

### Project Structure
- `/app` - Next.js App Router pages and layouts
- `/components/ui` - shadcn/ui base components
- `/customer-service` - Intelligent customer service module
- `/sofa-digital-human` - Digital human core module
- `/text-to-image` - AI image generation module
- `/hooks` - Custom React hooks
- `/lib` - Utility functions

### Known Limitations
- No testing framework configured (resolved in v0.2.0)
- Missing CI/CD pipeline (planned for Phase 3)
- Duplicate directory structure (resolved in v0.2.0)
- TypeScript errors ignored in build (to be fixed)

---

## Version History Summary

| Version | Date | Description | Status |
|---------|------|-------------|--------|
| 0.2.0-dev | 2026-05-23 | Engineering baseline establishment | In Progress |
| 0.1.0 | 2026-05-23 | Initial MVP release | Released |

---

## Future Roadmap

See [Task Planning & Milestones](./docs/01-任务规划与节点目标.md) for detailed implementation plan.

### Planned for v0.2.0 (Week 1-2)
- [x] Configure DevOps toolchain
- [x] Integrate component directories
- [x] Set up Vitest testing framework
- [x] Create developer documentation suite
- [ ] Establish Git Flow workflow
- [ ] Achieve 60%+ test coverage

### Planned for v0.3.0 (Week 3-6)
- Complete core business modules
- Integration testing
- E2E test scenarios
- Performance optimization basics

### Planned for v1.0.0 (Q4 2026)
- Production-ready deployment
- Security audit passed
- 90%+ test coverage
- Full monitoring system
- Official public release

---

**Note**: For detailed technical changes, please refer to git commit history.
