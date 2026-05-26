# Contributing to YYC³ Smart Service Engine

感谢您考虑为 **YYC³ Smart Service Engine (YYC³-SSE)** 做出贡献！本文档将帮助您了解贡献流程和规范。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [测试要求](#测试要求)

---

## 行为准则

参与本项目即表示您同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。简单来说：
- 尊重他人
- 接受建设性批评
- 专注于对社区最有利的事情
- 对其他社区成员表示同理心

---

## 如何贡献

### 报告 Bug

如果您发现了 bug，请通过 GitHub Issues 提交，包含以下信息：
- 清晰的标题和描述
- 复现步骤（尽可能详细）
- 期望的行为 vs 实际行为
- 截图或录屏（如适用）
- 环境信息（操作系统、浏览器、Node 版本等）

### 提出新功能

在提出新功能前，请先讨论：
1. 查看现有 Issue 是否已有类似提议
2. 创建 Feature Request Issue，描述：
   - 用例场景
   - 预期解决方案
   - 替代方案考虑
   - 与现有功能的关联

### 代码贡献

#### 小改进（文档、小修复）

直接 Fork 并提交 PR 即可。

#### 大改动（新功能、架构变更）

1. 先创建 Issue 讨论
2. 获得维护者确认后开始实现
3. 遵循下面的开发流程

---

## 开发流程

### 1. Fork 和 Clone

```bash
# Fork 仓库到您的 GitHub 账户后
git clone https://github.com/<your-username>/my-v0-project.git
cd my-v0-project
git upstream add https://github.com/<original-owner>/my-v0-project.git
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

**分支命名规范**:
- `feature/*` - 新功能
- `fix/*` - Bug 修复
- `refactor/*` - 代码重构
- `docs/*` - 文档更新
- `test/*` - 测试相关
- `chore/*` - 构建/工具链

### 4. 编写代码

遵循项目的[代码规范](#代码规范)，确保：
- ✅ 代码通过 ESLint 检查 (`pnpm lint`)
- ✅ 代码符合 Prettier 格式 (`pnpm format:check`)
- ✅ 新增功能有对应的单元测试
- ✅ 所有测试通过 (`pnpm test:run`)

### 5. 本地验证

```bash
# 类型检查
pnpm typecheck

# Lint 检查
pnpm lint

# 运行测试
pnpm test:run --coverage

# 构建验证
pnpm build
```

### 6. 提交代码

遵循[提交规范](#提交规范)：

```bash
git add .
git commit -m "feat(component): add new feature description"
```

### 7. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

---

## 代码规范

### TypeScript

- 启用严格模式 (`strict: true`)
- 优先使用 `interface` 而非 `type`（对象类型时）
- 避免使用 `any`，优先使用具体类型或 `unknown`
- 函数参数和返回值必须有类型注解

```tsx
// ✅ Good
interface User {
  id: string;
  name: string;
}

async function getUser(id: string): Promise<User> { ... }

// ❌ Bad
function getUser(id) { return user as any; }
```

### React/Next.js

- 使用函数式组件和 Hooks
- Props 解构并定义 interface
- 使用 `"use client"` 或 `"use server"` 指令明确标记
- 避免不必要的 re-render（useCallback, useMemo）

```tsx
// ✅ Good
"use client";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn(variantStyles[variant])}>
      {label}
    </button>
  );
}
```

### 样式 (Tailwind CSS)

- 优先使用 Tailwind 工具类
- 使用 `cn()` 工具函数合并类名
- 响应式设计：`sm:` `md:` `lg:` `xl:`

```tsx
// ✅ Good
<div className="flex flex-col gap-4 md:flex-row md:items-center">
  <p className="text-sm text-muted-foreground">Description</p>
</div>

// ❌ Bad
<style jsx>{`.container { display: flex; }`}</style>
```

### 组件组织

- 一个组件一个文件
- 组件文件名使用 PascalCase
- Hooks 文件名以 `use` 开头
- 工具函数放在 `lib/` 目录

```
components/
├── ui/                    # 基础 UI 组件
│   ├── button.tsx
│   └── card.tsx
├── features/              # 业务功能组件
│   ├── customer-service/
│   └── digital-human/
└── layout/                # 布局组件
```

---

## 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，并通过 [commitlint](commitlint.config.js) 强制执行。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 列表

| Type | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更（不含代码变更） |
| `style` | 代码格式（不影响功能） |
| `refactor` | 代码重构（非新功能、非修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链/依赖变更 |
| `ci` | CI/CD 配置变更 |
| `revert` | 回滚提交 |

### Scope 列表（常用）

- `components` / `ui` - UI 组件
- `hooks` - React Hooks
- `docs` - 文档
- `tests` - 测试
- `ci` - CI/CD
- `build` - 构建配置
- `deps` - 依赖更新

### 示例

```bash
# 新功能
feat(customer-service): add smart-dialog flow management

# Bug 修复
fix(hooks): resolve useAIContext race condition in concurrent calls

# 文档
docs(readme): update installation guide with pnpm instructions

# 重构
refactor(utils): extract common validation logic to separate module

# 测试
test(components): add Button component unit tests with edge cases

# 性能
perf(image-generator): implement lazy loading for generated images

# Chore
chore(deps): upgrade next.js from 14.2.24 to 14.2.25
```

---

## Pull Request 流程

### PR 标题格式

PR 标题应遵循 commit message 格式：
- `feat: add new feature`
- `fix: resolve issue #123`

### PR 描述模板

创建 PR 时，请填写以下内容：

```markdown
## 相关 Issue
Closes #(issue number)

## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重构
- [ ] 文档更新
- [ ] 其他：___

## 变更描述
简要描述本次变更的内容和原因...

## 测试清单
- [ ] 已添加/更新单元测试
- [ ] 所有测试通过 (`pnpm test:run`)
- [ ] 测试覆盖率未下降
- [ ] 手动测试通过

## 截图/录屏（如适用）
添加截图或 GIF 展示变更效果...

## 检查清单
- [ ] 代码符合 ESLint 规范 (`pnpm lint`)
- [ ] 代码符合 Prettier 格式 (`pnpm format:check`)
- [ ] TypeScript 类型检查通过 (`pnpm typecheck`)
- [ ] 构建成功 (`pnpm build`)
- [ ] 文档已更新（如需要）
- [ ] 没有 merge 冲突（或已解决）

## 其他说明
其他需要审查者注意的信息...
```

### 审查流程

1. **自动检查**: CI 会自动运行 lint、test、build
2. **Code Review**: 至少一位维护者审查
3. **修改反馈**: 根据反馈修改（push 到同一 branch 即可）
4. **Approval**: 获得批准后合并
5. **Squash Merge**: 维护者会使用 squash merge 合并

---

## 测试要求

### 单元测试

- 使用 **Vitest** 作为测试框架
- 使用 **@testing-library/react** 进行组件测试
- 测试文件命名: `*.test.ts` 或 `*.test.tsx`
- 测试文件与源文件同目录或 `tests/` 目录

### 覆盖率要求

| 文件类型 | 最低覆盖率 |
|----------|-----------|
| `lib/utils.ts` | 100% |
| `hooks/*.ts` | 80%+ |
| `components/**/*.tsx` | 70%+ |
| 业务逻辑代码 | 80%+ |

### 测试示例

```typescript
// tests/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'active', false && 'hidden'))
      .toBe('base-class active')
  })
})
```

---

## 需要帮助？

- 💬 **Questions**: 使用 [GitHub Discussions](../../discussions)
- 🐛 **Bugs**: 通过 [GitHub Issues](../../issues) 提交
- 💡 **Ideas**: 创建 Feature Request Issue
- 📧 **Direct Contact**: admin@0379.email

---

感谢您为 YYC³ AI Bot 做出的贡献！🎉
