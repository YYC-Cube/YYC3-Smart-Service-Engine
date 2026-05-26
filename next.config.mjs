/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 输出模式：静态导出（用于 Gitee Pages / GitHub Pages / CDN）
  output: 'export',

  // 🔧 Next.js 16 优化配置 - 严格模式已启用

  // ✅ TypeScript 严格模式 - 构建时进行类型检查
  typescript: {
    ignoreBuildErrors: false,
  },

  // 📸 图片优化（静态导出必须关闭）
  images: {
    unoptimized: true,
  },

  // ✨ Next.js 16 实验性特性
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
    ],
  },

  // 🌐 基础路径配置（Gitee Pages 使用）
  // 如果部署到子目录，取消注释并设置：
  // basePath: '/YYC3-Smart-Service-Engine',

  // 🔒 安全响应头（增强版）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // 🔀 重定向规则（静态导出需要）
  async redirects() {
    return []
  },
}

export default nextConfig
