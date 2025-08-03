#!/usr/bin/env node

// Simple authentication test script
const https = require('https');
const http = require('http');

const BASE_URL = process.env.VERCEL_URL || process.env.BASE_URL || 'http://localhost:3000';

console.log('🔐 Testing Authentication System');
console.log('📍 Base URL:', BASE_URL);

// Test 1: Check session endpoint without auth (should return null)
async function testSessionWithoutAuth() {
  console.log('\n1️⃣ Testing session endpoint without authentication...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`);
    const data = await response.json();
    
    if (data === null) {
      console.log('✅ Session endpoint correctly returns null for unauthenticated user');
      return true;
    } else {
      console.log('❌ Session endpoint should return null for unauthenticated user, got:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing session endpoint:', error.message);
    return false;
  }
}

// Test 2: Check providers endpoint
async function testProvidersEndpoint() {
  console.log('\n2️⃣ Testing providers endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/providers`);
    const data = await response.json();
    
    if (data && data.credentials && data.credentials.type === 'credentials') {
      console.log('✅ Providers endpoint correctly returns credentials provider');
      return true;
    } else {
      console.log('❌ Providers endpoint should return credentials provider, got:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing providers endpoint:', error.message);
    return false;
  }
}

// Test 3: Check signout endpoint
async function testSignoutEndpoint() {
  console.log('\n3️⃣ Testing signout endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signout`, {
      method: 'POST'
    });
    const data = await response.json();
    
    if (data && data.message === 'Signed out') {
      console.log('✅ Signout endpoint works correctly');
      return true;
    } else {
      console.log('❌ Signout endpoint should return success message, got:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing signout endpoint:', error.message);
    return false;
  }
}

// Test 4: Check credentials endpoint with invalid data
async function testCredentialsEndpointInvalid() {
  console.log('\n4️⃣ Testing credentials endpoint with invalid data...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ Credentials endpoint correctly rejects invalid credentials');
      return true;
    } else {
      console.log('❌ Credentials endpoint should return 401 for invalid credentials, got status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error testing credentials endpoint:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting authentication system tests...\n');
  
  const results = await Promise.all([
    testSessionWithoutAuth(),
    testProvidersEndpoint(), 
    testSignoutEndpoint(),
    testCredentialsEndpointInvalid()
  ]);
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All authentication tests passed! System is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
}

// Only run if this is the main module
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };