// Password reset script for jos@iamjosaguiar.com
// Run this in your live database environment

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    // New password - change this to whatever you want
    const newPassword = 'tempPassword123!';
    const email = 'jos@iamjosaguiar.com';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true }
    });
    
    console.log('✅ Password reset successful for:', updatedUser);
    console.log('🔑 New password:', newPassword);
    console.log('⚠️  Please change this password after logging in!');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();