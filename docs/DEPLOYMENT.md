# 🚀 YYC³ Smart Service Engine - Deployment Guide

## 📋 部署概览

本项目使用 **Vercel Pages** 进行自动部署，域名：**https://sse.yyc3.top**

### 🎯 部署架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│  GitHub Actions │────▶│    Vercel       │
│                 │     │   (CI/CD)       │     │    Pages        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ https://sse.    │
                                               │ yyc3.top        │
                                               └─────────────────┘
```

---

## 🔧 前置要求

### 1️⃣ Vercel 账号设置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 登录并创建新项目（或导入现有项目）
3. 连接 GitHub 仓库：`YYC-Cube/YYC3-Smart-Service-Engine`

### 2️⃣ 配置环境变量

在 **Vercel Dashboard → Settings → Environment Variables** 中添加：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_APP_URL` | 应用 URL (https://sse.yyc3.top) | ✅ 是 |
| `NEXTAUTH_SECRET` | NextAuth 密钥 | ✅ 是 |
| `NEXTAUTH_URL` | 认证服务 URL | ✅ 是 |

**生成 NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3️⃣ GitHub Secrets 配置

在 **GitHub Repository → Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 说明 | 获取方式 |
|-------------|------|----------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel 组织 ID | `.vercel/project.json` 或 Dashboard |
| `VERCEL_PROJECT_ID` | 项目 ID | 同上 |

**获取 VERCEL_ORG_ID 和 VERCEL_PROJECT_ID**:
```bash
# 安装 Vercel CLI 并登录
pnpm add -g vercel
vercel login

# 拉取项目信息
vercel pull --yes
cat .vercel/project.json
```

---

## 🔄 CI/CD 工作流说明

### 📁 工作流文件位置

- **CI 流程**: [.github/workflows/ci.yml](../.github/workflows/ci.yml)
- **部署流程**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

### 🚀 自动触发条件

| 触发事件 | 环境 | 说明 |
|----------|------|------|
| Push to `main` | Production | 自动部署到生产环境 |
| Pull Request to `main` | Preview | 创建预览部署 |
| Manual Dispatch | 可选 | 手动选择 production/preview |

### ⚙️ CI/CD Pipeline 流程

```
Push/PR Event
      │
      ▼
┌─────────────────┐
│ Lint & Format   │ ← ESLint + Prettier 检查
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ Type Check      │ ← TypeScript 类型检查
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│ Unit Tests      │ ← Vitest 测试套件 (318 tests)
└────────┬────────┘
         │ ✅ Pass (99.7%+)
         ▼
┌─────────────────┐
│ Build           │ ← Next.js Production Build
└────────┬────────┘
         │ ✅ Success
         ▼
┌─────────────────┐
│ Deploy to       │ ← Vercel Pages 部署
│ Vercel          │
└────────┬────────┘
         │ ✅ Deployed
         ▼
┌─────────────────┐
│ Health Checks   │ ← 验证生产环境可用性
└─────────────────┘
```

---

## 📦 本地部署测试

### 方式一：Vercel CLI 本地预览

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 生产构建测试
pnpm build
pnpm start
```

### 方式二：Vercel 预览部署

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录 Vercel
vercel login

# 部署到 Preview 环境
vercel

# 部署到 Production 环境
vercel --prod
```

---

## 🌐 域名配置

### 自定义域名: sse.yyc3.top

#### DNS 配置（已通过认证）

在域名 DNS 管理商处添加以下记录：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| CNAME | sse | cname.vercel-dns.com | Auto |

#### SSL 证书

✅ Vercel 自动提供 Let's Encrypt SSL 证书  
✅ HTTPS 强制跳转已启用  
✅ HSTS 头部已配置（max-age=63072000）

---

## 🔒 安全配置清单

### ✅ 已实现的安全措施

- [x] **HTTPS 强制加密**: 所有流量强制 HTTPS
- [x] **安全响应头**:
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security: max-age=63072000
  - X-XSS-Protection: 1; mode=block
  - Permissions-Policy: 限制摄像头/麦克风/地理位置
- [x] **CSP Headers**: Content-Security-Policy 已配置
- [x] **环境变量保护**: 敏感数据存储在 Secrets 中，不提交代码库
- [x] **依赖扫描**: 定期检查已知漏洞
- [x] **Git 安全**: .gitignore 排除敏感文件

---

## 📊 监控与日志

### Vercel 内置监控

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 **yyc3-smart-service-engine**
3. 查看：
   - **Deployments**: 部署历史和状态
   - **Analytics**: 访问统计和性能指标
   - **Logs**: 实时日志和错误追踪
   - **Speed Insights**: 页面加载性能

### 性能目标

| 指标 | 目标值 | 当前状态 |
|------|--------|----------|
| First Contentful Paint | < 1.5s | ✅ 优秀 |
| Largest Contentful Paint | < 2.5s | ✅ 优秀 |
| Time to Interactive | < 3.0s | ✅ 良好 |
| Cumulative Layout Shift | < 0.1 | ✅ 优秀 |

---

## 🆘 故障排查

### 常见问题

#### 1. 部署失败：Build Error

```bash
# 检查本地构建是否成功
pnpm install
pnpm build

# 常见原因:
# - Node.js 版本不匹配 (需要 20.x LTS)
# - 依赖安装失败 (删除 node_modules 重试)
# - TypeScript 类型错误 (运行 pnpm typecheck)
```

#### 2. 环境变量未生效

```bash
# 确认变量名称正确 (必须以 NEXT_PUBLIC_ 开头才能客户端访问)
# 在 Vercel Dashboard → Settings → Environment Variables 检查
# 重新触发部署: vercel --prod
```

#### 3. 域名无法访问

```bash
# 检查 DNS 解析
dig sse.yyc3.top

# 应该返回 Vercel IP 地址 (76.76.21.21)

# 检查 SSL 证书
openssl s_client -connect sse.yyc3.top:443
```

#### 4. GitHub Actions 失败

```bash
# 检查 Secrets 是否正确配置
# 验证 VERCEL_TOKEN 权限 (需要 Full Access)
# 查看 Actions 日志获取详细错误信息
```

---

## 📝 更新部署

### 日常更新流程

1. **开发完成并测试通过**
   ```bash
   pnpm test:run
   pnpm build
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "feat(module): description"
   git push origin main
   ```

3. **自动部署触发**
   - GitHub Actions 自动运行 CI 流程
   - 通过后自动部署到 Vercel
   - 约 2-5 分钟后可在 https://sse.yyc3.top 访问

4. **验证部署**
   - 访问 https://sse.yyc3.top
   - 检查功能正常运行
   - 查看 Vercel Dashboard 确认状态

### 回滚版本

如果部署出现问题：

1. 访问 Vercel Dashboard → Deployments
2. 找到之前稳定的版本
3. 点击 "..." → "Promote to Production"
4. 或者使用 Git 回滚：
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 📞 技术支持

如遇问题：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [GitHub Actions 日志](https://github.com/YYC-Cube/YYC3-Smart-Service-Engine/actions)
3. 联系团队维护人员

---

**最后更新**: 2026-05-26  
**部署版本**: v3.0.0  
**文档维护**: YYC³ Team
