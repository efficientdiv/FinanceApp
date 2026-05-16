import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs'],
  // Include Prisma's native query engine binary in the serverless bundle.
  // Required because the generated client is at a custom output path.
  outputFileTracingIncludes: {
    '**': ['./src/generated/prisma/**'],
  },
  outputFileTracingRoot: process.env.VERCEL ? undefined : path.join(__dirname, '../../..'),
}

export default nextConfig
