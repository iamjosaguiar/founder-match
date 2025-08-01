-- Fix assessmentCompleted field for existing users
-- This migration sets assessmentCompleted to false for all users who have NULL values

UPDATE users 
SET assessmentCompleted = 0 
WHERE assessmentCompleted IS NULL;

-- Verify the update
SELECT email, assessmentCompleted, quizCompleted 
FROM users 
ORDER BY email;