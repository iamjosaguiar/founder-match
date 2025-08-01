-- Simple password reset for jos@iamjosaguiar.com
-- Password: "reset123" (without quotes)

-- First, check if the user exists and current password status
SELECT id, email, name, 
       CASE WHEN password IS NULL THEN 'NULL' ELSE 'HAS_PASSWORD' END as password_status
FROM users WHERE email = 'jos@iamjosaguiar.com';

-- Reset password to "reset123" (simpler password for testing)
UPDATE users 
SET password = '$2b$12$Gan1THCPwu/OF.98qAP2xuo4eFC4E3QPnlyvKQfZAFwVBSrb1dZB.'
WHERE email = 'jos@iamjosaguiar.com';

-- Verify the update worked
SELECT id, email, name,
       CASE WHEN password IS NULL THEN 'NULL' 
            WHEN password = '' THEN 'EMPTY'
            ELSE 'PASSWORD_SET' END as password_status,
       LENGTH(password) as password_length
FROM users WHERE email = 'jos@iamjosaguiar.com';