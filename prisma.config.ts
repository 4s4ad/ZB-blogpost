import path from 'path'
import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
  migrations: {
    seed: 'npx ts-node prisma/seed.ts'
  }
})
