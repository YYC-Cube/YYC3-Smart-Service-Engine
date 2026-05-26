# 🚀 YYC³ Smart Service Engine - Deployment Guide

## 📋 部署概览

本项目使用 **CI/CD 自动构建** + **手动/自动部署** 方案。

**生产域名**: **https://sse.yyc3.top** (DNS 已认证)

### 🎯 部署架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GitHub Repo   │────▶│  GitHub Actions │────▶│  Build Artifacts│
│                 │     │   (CI Pipeline) │     │    (.next/)      │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                        │
                                                   手动下载 / 自动部署
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ Your Hosting     │
                                               │ Platform         │
                                               │ (Any Provider)   │
                                               └────────┬────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │ https://sse.    │
                                               │ yyc3.top        │
                                               └─────────────────┘
```

---

## 🔧 CI/CD 工作流说明

### 📁 工作流文件

- **CI 流程**: [.github/workflows/ci.yml](../.github/workflows/ci.yml) - Lint、TypeCheck、Test、Build
- **构建流程**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) - 完整构建并上传 artifacts

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
│ Upload          │ ← 上传构建产物到 GitHub Artifacts
│ Artifacts       │   (保留 7 天)
└─────────────────┘
```

### 🚀 触发条件

| 触发事件 | 说明 |
|----------|------|
| Push to `main` | 完整构建 + 上传 artifacts |
| Push to `develop` | 开发分支构建验证 |
| Pull Request | PR 构建验证 |
| Manual Dispatch | 手动触发构建 |

---

## 📦 本地构建

### 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev
# 访问 http://localhost:3000

# 生产构建测试
pnpm build
pnpm start
```

### 构建输出

成功后生成：
- `.next/` - Next.js 生产构建输出
- `public/` - 静态资源（已优化）

**当前构建性能**: ⚡ **1.414s 编译时间** (优秀级别)

---

## 🌐 部署方案选择

### 方案一：静态导出 + CDN 托管（推荐）

适用于：静态网站托管服务（GitHub Pages, Cloudflare Pages, Netlify 等）

#### 步骤：

1. **配置 Next.js 静态导出**
   
   在 [next.config.mjs](../next.config.mjs) 中添加：
   ```javascript
   const nextConfig = {
     output: 'export',  // 添加这行
     // ... 其他配置
   }
   ```

2. **运行静态导出构建**
   ```bash
   pnpm build
   # 输出目录: out/
   ```

3. **上传到托管平台**

   **GitHub Pages 示例**:
   ```bash
   # 将 out/ 目录内容推送到 gh-pages 分支
   git subtree push --prefix out origin gh-pages
   ```

   **Cloudflare Pages / Netlify**:
   - 连接 GitHub 仓库
   - 设置构建命令: `pnpm build`
   - 设置输出目录: `out` (或 `.next` for SSR)

4. **配置自定义域名 DNS**

   在域名 DNS 管理商添加记录：

   | 类型 | 名称 | 值 | 说明 |
   |------|------|-----|------|
   | CNAME | sse | `你的托管平台地址` | 例如: `username.github.io` 或 `pages.dev` |

---

### 方案二：Node.js 服务器部署（SSR）

适用于：VPS、云服务器、Docker 容器等

#### 步骤：

1. **准备服务器环境**

   ```bash
   # 安装 Node.js 20 LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装 pnpm
   npm install -g pnpm
   ```

2. **上传构建产物**

   **方式 A: 从 GitHub Actions 下载**
   - 访问 Actions 页面 → 选择成功的 workflow run
   - 下载 `nextjs-build-*` artifact
   - 解压到服务器 `/var/www/yyc3-sse/`

   **方式 B: Git 克隆 + 构建**
   ```bash
   cd /var/www/
   git clone https://github.com/YYC-Cube/YYC3-Smart-Service-Engine.git yyc3-sse
   cd yyc3-sse
   pnpm install --production
   pnpm build
   ```

3. **启动应用**

   使用 PM2 进程管理器：
   ```bash
   # 安装 PM2
   npm install -g pm2

   # 启动应用
   cd /var/www/yyc3-sse
   PM2_HOME=/var/www/.pm2 pm2 start npm --name "yyc3-sse" -- start

   # 设置开机自启
   PM2_HOME=/var/www/.pm2 pm2 startup
   PM2_HOME=/var/www/.pm2 pm2 save
   ```

4. **配置 Nginx 反向代理**

   创建 `/etc/nginx/sites-available/yyc3-sse`:
   ```nginx
   server {
       listen 80;
       server_name sse.yyc3.top;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   启用站点：
   ```bash
   sudo ln -s /etc/nginx/sites-available/yyc3-sse /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

5. **配置 SSL (Let's Encrypt)**

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d sse.yyc3.top
   ```

---

### 方案三：Docker 容器化部署

#### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@8 --activate
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && corepack prepare pnpm@8--activate
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. 更新 next.config.mjs

确保启用 standalone 输出：
```javascript
const nextConfig = {
  output: 'standalone',  // Docker 部署必需
  // ... 其他配置
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t yyc3-sse .

# 运行容器
docker run -d \
  --name yyc3-sse \
  -p 3000:3000 \
  --restart unless-stopped \
  yyc3-sse

# 或使用 docker-compose
docker-compose up -d
```

创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

---

## 🔒 安全配置清单

### ✅ 已实现的安全措施

- [x] **安全响应头** ([next.config.mjs](../next.config.mjs)):
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security: max-age=63072000
  - X-XSS-Protection: 1; mode=block
  - Permissions-Policy: 限制敏感权限

- [x] **TypeScript 严格模式**: 类型安全保障
- [x] **ESLint 代码检查**: 代码质量保障
- [x] **依赖扫描**: 定期漏洞检测建议

### 🔒 建议额外配置

对于生产环境，建议配置：

1. **HTTPS 强制跳转** (Nginx/CDN 层面)
2. **WAF 防火墙** (Cloudflare/AWS WAF)
3. **Rate Limiting** (防止 DDoS)
4. **CSP Headers** (Content-Security-Policy)

---

## 📊 监控与日志

### 应用监控

推荐工具：
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse CI, WebPageTest

### 日志管理

**PM2 日志** (方案二):
```bash
PM2_HOME=/var/www/.pm2 pm2 logs yyc3-sse
```

**Docker 日志** (方案三):
```bash
docker logs -f yyc3-sse
```

---

## 🆘 故障排查

### 常见问题

#### 1. 构建失败

```bash
# 检查本地构建
pnpm install
pnpm build

# 常见原因:
# - Node.js 版本不匹配 (需要 20.x LTS)
# - 依赖安装失败 (删除 node_modules 重试)
# - TypeScript 错误 (运行 pnpm typecheck)
```

#### 2. 端口被占用

```bash
# 查看占用端口的进程
lsof -i :3000

# 杀掉进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 pnpm start
```

#### 3. 环境变量未生效

```bash
# 确认 .env.local 文件存在且格式正确
# 重启应用使环境变量生效
PM2_HOME=/var/www/.pm2 pm2 restart yyc3-sse
```

#### 4. 域名无法访问

```bash
# 检查 DNS 解析
dig sse.yyc3.top

# 检查 Nginx 配置
sudo nginx -t

# 检查 SSL 证书
openssl s_client -connect sse.yyc3.top:443
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

3. **CI 自动构建**
   - GitHub Actions 自动运行完整 pipeline
   - 构建产物上传至 Artifacts (保留 7 天)

4. **部署更新**
   - **手动部署**: 下载最新 artifacts → 上传到服务器
   - **自动部署**: 根据选择的平台配置 webhook/自动同步

5. **验证部署**
   - 访问 https://sse.yyc3.top
   - 检查功能正常运行

### 回滚版本

如果部署出现问题：

**方案二 (VPS)**:
```bash
cd /var/www/yyc3-sse
git revert HEAD
pnpm build
PM2_HOME=/var/www/.pm2 pm2 restart yyc3-sse
```

**方案三 (Docker)**:
```bash
# 回滚到之前的镜像版本
docker stop yyc3-sse
docker rm yyc3-sse
docker run -d --name yyc3-sse -p 3000:3000 <previous-image-hash>
```

---

## 📞 技术支持

如遇问题：

1. 查看 [GitHub Actions 日志](https://github.com/YYC-Cube/YYC3-Smart-Service-Engine/actions)
2. 检查项目 [Issues](https://github.com/YYC-Cube/YYC3-Smart-Service-Engine/issues)
3. 联系团队维护人员

---

## 📊 性能目标

| 指标 | 目标值 | 当前状态 |
|------|--------|----------|
| Build Time | < 30s | ⚡ 1.4s (优秀) |
| First Contentful Paint | < 1.5s | 待测试 |
| Largest Contentful Paint | < 2.5s | 待测试 |
| Time to Interactive | < 3.0s | 待测试 |
| Uptime | > 99.9% | 取决于托管平台 |

---

**最后更新**: 2026-05-26  
**部署版本**: v3.0.0  
**文档维护**: YYC³ Team  
**适用平台**: Any Node.js Hosting / Docker / Static Hosting
