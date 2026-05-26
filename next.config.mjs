/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔧 Next.js 16 优化配置 - 严格模式已启用

  // ✅ TypeScript 严格模式 - 构建时进行类型检查
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  // ✨ Next.js 16 实验性特性
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
    ],
  },

  // 🌐 域名配置 (Vercel Pages)
  // 注: 域名重定向由 Vercel 自动处理，无需在 Next.js 中配置
  // Vercel 会自动将 sse.yyc3.top 指向项目

  // 🔒 安全响应头 (增强版)
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
}

export default nextConfig
