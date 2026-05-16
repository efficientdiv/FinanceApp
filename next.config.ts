import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  // iCloud Drive paths contain spaces which break file tracing locally.
  // On Vercel the path is clean so we skip this — otherwise the root resolves
  // too far up and Vercel reconstructs a doubled path like /vercel/path0/vercel/path0/...
  outputFileTracingRoot: process.env.VERCEL ? undefined : path.join(__dirname, '../../..'),
}

export default nextConfig
