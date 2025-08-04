import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma configuration for production reliability
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Connection pooling and timeout settings for production
    ...(process.env.NODE_ENV === 'production' && {
      // Increase timeout for production
      __internal: {
        engine: {
          requestTimeout: 60000, // 60 seconds
          connectTimeout: 60000,  // 60 seconds
        }
      }
    })
  })

// Enhanced connection management
let isConnected = false
let connectionPromise: Promise<void> | null = null

// Connect with retry logic
async function connectWithRetry(retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      isConnected = true
      console.log('✅ Database connected successfully')
      return
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error)
      if (i === retries - 1) throw error
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}

// Initialize connection
if (!connectionPromise) {
  connectionPromise = connectWithRetry().catch(error => {
    console.error('💥 Failed to connect to database after retries:', error)
    isConnected = false
  })
}

// Graceful shutdown handling
const gracefulShutdown = async () => {
  if (isConnected) {
    console.log('🔄 Disconnecting from database...')
    await prisma.$disconnect()
    isConnected = false
    console.log('✅ Database disconnected')
  }
}

// Handle various shutdown signals
process.on('beforeExit', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export connection status for health checks
export const getDatabaseStatus = () => ({
  isConnected,
  connectionPromise
})

// Export connection helper
export const ensureConnection = async () => {
  if (!isConnected && connectionPromise) {
    await connectionPromise
  }
  return isConnected
}