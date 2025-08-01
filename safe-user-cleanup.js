// Safe user cleanup script for jos@iamjosaguiar.com
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupUser() {
  try {
    const email = 'jos@iamjosaguiar.com';
    
    console.log(`🔍 Looking for user: ${email}`);
    
    // Find user first
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      console.log('✅ User not found - safe to create new account');
      return;
    }
    
    console.log(`👤 Found user:`, user);
    const userId = user.id;
    
    // Clean up all relationships in correct order
    console.log('🧹 Cleaning up relationships...');
    
    // Community relationships
    await prisma.commentLike.deleteMany({ where: { userId: userId } });
    await prisma.postLike.deleteMany({ where: { userId: userId } });
    await prisma.forumComment.deleteMany({ where: { authorId: userId } });
    await prisma.forumPost.deleteMany({ where: { authorId: userId } });
    console.log('✅ Community data cleaned');
    
    // Project relationships  
    await prisma.projectMatch.deleteMany({ where: { serviceProviderId: userId } });
    await prisma.project.deleteMany({ where: { ownerId: userId } });
    console.log('✅ Project data cleaned');
    
    // Matching relationships
    await prisma.match.deleteMany({ 
      where: { 
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    });
    console.log('✅ Match data cleaned');
    
    // Auth relationships
    await prisma.session.deleteMany({ where: { userId: userId } });
    await prisma.account.deleteMany({ where: { userId: userId } });
    console.log('✅ Auth data cleaned');
    
    // Finally delete the user
    await prisma.user.delete({ where: { id: userId } });
    console.log('✅ User deleted successfully');
    
    console.log('🎉 Cleanup complete! Safe to create new account.');
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupUser();