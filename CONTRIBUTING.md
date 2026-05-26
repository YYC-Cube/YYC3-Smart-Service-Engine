# Contributing to YYC³ Smart Service Engine

感谢你对 YYC³ Smart Service Engine 项目的关注！我们欢迎各种形式的贡献，包括但不限于代码、文档、bug 报告和功能建议。

## 🤝 贡献方式

### 1. 报告 Bug 🐛

如果你发现了 bug，请通过以下步骤报告：

- **检查现有 Issues**：确保该 bug 未被报告过
- **使用 Issue 模板**：提供清晰的重现步骤
- **包含环境信息**：操作系统、Node.js 版本、浏览器等
- **添加截图/日志**：如果适用的话

### 2. 提交功能建议 💡

我们欢迎功能建议！请：

- **详细描述功能**：说明用途和使用场景
- **提供示例**：如果有 UI 设计或伪代码会更好
- **讨论优先级**：我们可以一起评估实现价值

### 3. 代码贡献 💻

#### 开发环境设置

```bash
# 克隆仓库
git clone git@gitee.com:yyc-cube/yyc3-smart-service-engine.git

# 进入项目目录
cd YYC3-Smart-Service-Engine

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test:run

# 检查代码风格
pnpm lint && pnpm format:check
```

#### 分支策略

```
main          ← 生产分支（受保护）
develop       ← 开发分支
feature/*     ← 新功能分支
fix/*         ← Bug 修复分支
docs/*        ← 文档更新分支
```

#### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变更

**示例**：

```bash
feat(auth): add OAuth2 login support

Implement OAuth2 authentication with GitHub and Google providers.
Add new login page component and update auth configuration.

Closes #123
```

#### Pull Request 流程

1. **Fork 仓库**

   ```bash
   # Fork 并克隆你的 fork
   git clone https://gitee.com/<your-username>/YYC3-Smart-Service-Engine.git
   ```

2. **创建特性分支**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行开发**
   - 编写代码
   - 添加测试（如有）
   - 更新文档（如有）

4. **运行测试**

   ```bash
   pnpm lint           # ESLint 检查
   pnpm format:check   # Prettier 格式检查
   pnpm typecheck      # TypeScript 类型检查
   pnpm test:run       # 单元测试
   pnpm build          # 构建验证
   ```

5. **提交更改**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

6. **推送到你的 Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问 Gitee 仓库页面
   - 点击 "Pull Request" → "新建"
   - 填写 PR 模板信息
   - 关联相关 Issue（如有）

### 4. 文档贡献 📝

文档同样重要！你可以帮助改进：

- **README.md**: 项目介绍和快速开始
- **API 文档**: 接口使用说明
- **教程**: 使用指南和最佳实践
- **翻译**: 多语言支持
- **代码注释**: 提高代码可读性

## 📋 代码规范

### TypeScript

- ✅ 使用 TypeScript strict mode
- ✅ 为所有函数添加类型注解
- ✅ 避免使用 `any` 类型
- ✅ 使用接口定义对象结构

### React/Next.js

- ✅ 使用函数组件 + Hooks
- ✅ 组件名使用 PascalCase
- ✅ 文件名与组件名一致
- ✅ Props 接口单独导出

### 样式

- ✅ 使用 Tailwind CSS 或 shadcn/ui 组件
- ✅ 遵循项目现有的设计系统
- ✅ 保持响应式设计
- ✅ 支持深色模式

### 测试

- ✅ 新功能必须包含单元测试
- ✅ 测试覆盖率目标 > 90%
- ✅ 使用 Vitest 测试框架
- ✅ Mock 外部依赖

## 🔍 代码审查流程

所有 PR 都需要经过代码审查：

1. **自动化检查**
   - CI/CD Pipeline 必须通过
   - 所有测试必须通过
   - 代码覆盖率不能下降

2. **人工审查**
   - 至少 1 位维护者审核
   - 关注点：代码质量、性能、安全性
   - 审查者会在 48 小时内响应

3. **修改建议**
   - 根据 feedback 修改代码
   - 再次推送更新
   - 重新触发 CI 检查

4. **合并**
   - 审核通过后合并到 develop
   - 定期从 develop 合并到 main

## 🎯 优先级标签

我们在 Issue 中使用以下标签标记优先级：

- `🔴 critical`: 紧急问题，影响生产环境
- `🟠 high`: 重要功能/Bug，计划在当前版本修复
- `🟡 normal`: 一般功能/Bug，计划在下一版本
- `🟢 low`: 锦上添花的功能，有时间再做

## 💬 社区准则

### 我们期望的行为

- ✅ 尊重他人，保持专业和友善
- ✅ 接受建设性批评
- ✅ 关注对社区最有利的事情
- ✅ 对其他社区成员表示同理心

### 不可接受的行为

- ❌ 骚扰、歧视或侮辱性语言
- ❌ 发布他人的私人信息
- ❌ 其他不当的专业行为

## 🎁 贡献者认可

所有贡献者都会被添加到 [CONTRIBUTORS.md](./CONTRIBUTORS.md) 文件中。

特别活跃的贡献者将获得：

- 项目 Collaborator 权限
- 在 README 中特别致谢
- YYC³ Family 社区成员身份

## 📞 获取帮助

如果你有任何问题：

- **查看文档**: [README.md](./README.md), [docs/](./docs/)
- **搜索 Issues**: 可能已有类似问题和解决方案
- **创建 Discussion**: 在 Gitee 上发起新讨论
- **联系维护者**: 通过 Issue @mention 相关人员

---

再次感谢你的贡献！🎉

让我们一起打造更好的 YYC³ Smart Service Engine！
