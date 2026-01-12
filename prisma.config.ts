import { defineConfig } from '@prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  },
  migrations: {
    seed: 'npx ts-node prisma/seed.ts'
  }
})
