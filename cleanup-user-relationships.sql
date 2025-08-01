-- Comprehensive cleanup for jos@iamjosaguiar.com before recreation
-- This removes all related data that could cause foreign key constraints

-- First, find the user ID (run this to get the ID before deletion)
SELECT id, email, name FROM users WHERE email = 'jos@iamjosaguiar.com';

-- Replace 'USER_ID_HERE' with the actual user ID from above query

-- Clean up Community relationships
DELETE FROM comment_likes WHERE userId = 'USER_ID_HERE';
DELETE FROM post_likes WHERE userId = 'USER_ID_HERE';
DELETE FROM forum_comments WHERE authorId = 'USER_ID_HERE';
DELETE FROM forum_posts WHERE authorId = 'USER_ID_HERE';

-- Clean up Project relationships
DELETE FROM project_matches WHERE serviceProviderId = 'USER_ID_HERE';
DELETE FROM projects WHERE ownerId = 'USER_ID_HERE';

-- Clean up Matching relationships
DELETE FROM matches WHERE senderId = 'USER_ID_HERE' OR receiverId = 'USER_ID_HERE';

-- Clean up Auth relationships
DELETE FROM sessions WHERE userId = 'USER_ID_HERE';
DELETE FROM accounts WHERE userId = 'USER_ID_HERE';

-- Finally, delete the user
DELETE FROM users WHERE email = 'jos@iamjosaguiar.com';

-- Verify cleanup
SELECT 'Cleanup complete' as status;