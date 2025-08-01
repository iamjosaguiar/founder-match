// Fresh password reset with new hash generation
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPasswordFresh() {
  try {
    const email = 'jos@iamjosaguiar.com';
    const newPassword = 'reset123';
    
    console.log('🔄 Generating fresh password hash...');
    
    // Generate a completely fresh hash
    const freshHash = await bcrypt.hash(newPassword, 12);
    console.log('✅ New hash generated:', freshHash);
    
    // Verify the hash works before updating database
    const testVerify = await bcrypt.compare(newPassword, freshHash);
    console.log('✅ Hash verification test:', testVerify);
    
    if (!testVerify) {
      console.log('❌ Hash verification failed! Aborting.');
      return;
    }
    
    // Update the database
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: freshHash },
      select: { id: true, email: true, name: true }
    });
    
    console.log('✅ Password reset successful for:', updatedUser);
    console.log('🔑 New password:', newPassword);
    console.log('⚠️  Please change this password after logging in!');
    
    // Double-check by fetching and testing
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { password: true }
    });
    
    const finalVerify = await bcrypt.compare(newPassword, user.password);
    console.log('✅ Final verification:', finalVerify);
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPasswordFresh();