---
FAMILYfile: 001-AI-Family-项目总览索引-项目总览手册.md
FAMILYdescription: my-v0-project 项目总览手册 — 技术架构与开发指南
author: YanYuCloudCube Team <admin@0379.email>
familyversion: v1.0.0
created: 2026-05-23
updated: 2026-05-23
status: published
FAMILYtags: [项目总览],[技术架构],[开发指南]
FAMILYcategorycategory: 项目总览索引
language: zh-CN
audience: developers,stakeholders
complexity: intermediate
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# my-v0-project 项目总览手册

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

## 项目概述

**项目名称**: my-v0-project
**项目类型**: Next.js
**描述**: 
**版本**: 0.1.0

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| ui_library | React ^19 |
| language | TypeScript 5.7.3 |
| styling | Tailwind CSS ^3.4.17 |
| component_library | Radix UI / shadcn/ui |
| charts | Recharts 2.15.0 |
---

## 项目结构

```
.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ui
│   ├── enhanced-image-generator.tsx
│   ├── enhanced-voice-interface.tsx
│   └── theme-provider.tsx
├── customer-service
│   ├── page.tsx
│   ├── script-management.tsx
│   ├── smart-customer-service.tsx
│   └── sofa-sales-system.tsx
├── hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── useAIContext.ts
│   ├── useTextToSpeech.ts
│   └── useVoiceRecognition.ts
├── intelligent-customer-operations
│   ├── customer-lifecycle-manager.tsx
│   └── smart-form-system.tsx
├── lib
│   └── utils.ts
├── public
│   ├── apple-icon.png
│   ├── icon-dark-32x32.png
│   ├── icon-light-32x32.png
│   ├── icon.svg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── sofa-digital-human
│   └── digital-human-core.tsx
├── styles
│   └── globals.css
├── text-to-image
│   └── text-to-image-generator.tsx
├── ui
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── aspect-ratio.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── context-menu.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── hover-card.tsx
│   ├── input-otp.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── menubar.tsx
│   ├── navigation-menu.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── resizable.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── toggle-group.tsx
│   ├── toggle.tsx
│   ├── tooltip.tsx
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── YYC3-团队通用-标准规范
│   ├── template_config.yaml
│   ├── YYC3-代码审核-全局审核报告.md
│   ├── YYC3-核心机制-五高五标五化五维.md
│   ├── YYC3-团队通用-开发文档.md
│   ├── YYC3-团队规范-开发标准.md
│   ├── YYC3-团队规范-文档闭环.md
│   └── YYC3-docs.py
├── components.json
├── customer-creation-form.tsx
├── dashboard.tsx
├── enhanced-image-generator.tsx
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── prompt-templates.ts
├── system-architecture.ts
├── tailwind.config.js
├── theme-provider.tsx
├── tsconfig.json
├── use-mobile.tsx
├── use-toast.ts
├── useAIContext.ts
├── useSmartPrompt.ts
├── useTextToSpeech.ts
├── useVoiceRecognition.ts
└── utils.ts

14 directories, 106 files

```

---

## 统计信息

| 指标 | 数值 |
|------|------|
| 总文件数 | 164 |
| TSX 组件 | 124 |
| TypeScript 文件 | 15 |
| 样式文件 | 2 |
| 配置文件 | 3 |


### Git 信息

| 属性 | 值 |
|------|-----|
| 当前分支 | v0/yyc-cube-ff71e42c |
| 最后提交 | 1f1e01c5 |
| 提交信息 | Initial commit from v0 |
| 提交日期 | 2026-02-17 06:42:44 +0000 |
| 提交作者 | v0 |
---

## 核心组件

- [components/enhanced-image-generator.tsx](/components/enhanced-image-generator.tsx)
- [components/enhanced-voice-interface.tsx](/components/enhanced-voice-interface.tsx)
- [components/theme-provider.tsx](/components/theme-provider.tsx)
- [components/ui/accordion.tsx](/components/ui/accordion.tsx)
- [components/ui/alert-dialog.tsx](/components/ui/alert-dialog.tsx)
- [components/ui/alert.tsx](/components/ui/alert.tsx)
- [components/ui/aspect-ratio.tsx](/components/ui/aspect-ratio.tsx)
- [components/ui/avatar.tsx](/components/ui/avatar.tsx)
- [components/ui/badge.tsx](/components/ui/badge.tsx)
- [components/ui/breadcrumb.tsx](/components/ui/breadcrumb.tsx)
- [components/ui/button-group.tsx](/components/ui/button-group.tsx)
- [components/ui/button.tsx](/components/ui/button.tsx)
- [components/ui/calendar.tsx](/components/ui/calendar.tsx)
- [components/ui/card.tsx](/components/ui/card.tsx)
- [components/ui/carousel.tsx](/components/ui/carousel.tsx)
- [components/ui/chart.tsx](/components/ui/chart.tsx)
- [components/ui/checkbox.tsx](/components/ui/checkbox.tsx)
- [components/ui/collapsible.tsx](/components/ui/collapsible.tsx)
- [components/ui/command.tsx](/components/ui/command.tsx)
- [components/ui/context-menu.tsx](/components/ui/context-menu.tsx)

---

## 页面路由

- [app/page.tsx](/app/page.tsx)

---

## 自定义 Hooks

- [hooks/use-mobile.tsx](/hooks/use-mobile.tsx)

---

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 或 npm

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

---

## 开发脚本

- `build`
- `dev`
- `lint`
- `start`

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>
