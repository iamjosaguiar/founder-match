// Debug auth issues for jos@iamjosaguiar.com
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    const email = 'jos@iamjosaguiar.com';
    const testPassword = 'reset123';
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 'N/A'
    });
    
    if (!user.password) {
      console.log('❌ User has no password set');
      return;
    }
    
    // Test password comparison
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('🔑 Password test for "' + testPassword + '":', isValid);
    
    // Test manual hash comparison
    const expectedHash = '$2b$12$Gan1THCPwu/OF.98qAP2xuo4eFC4E3QPnlyvKQfZAFwVBSrb1dZB.';
    console.log('🔍 Hash comparison:');
    console.log('  Expected:', expectedHash);
    console.log('  Actual:  ', user.password);
    console.log('  Match:   ', user.password === expectedHash);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();