-- Alternative SQL approach for password reset
-- This uses a bcrypt hash for the password "tempPassword123!"

-- First, check if the user exists
SELECT id, email, name FROM users WHERE email = 'jos@iamjosaguiar.com';

-- Reset password to "tempPassword123!" (bcrypt hash with salt rounds 12)  
UPDATE users 
SET password = '$2b$12$J/U8T4YOkUq8pdTYxXXIGOthSLRYeN6gdsgGPhnZfhKwNpEhVqoTa'
WHERE email = 'jos@iamjosaguiar.com';

-- Verify the update
SELECT id, email, name, password FROM users WHERE email = 'jos@iamjosaguiar.com';