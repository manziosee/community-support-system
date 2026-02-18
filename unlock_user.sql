-- Unlock account and verify email for manziosee3@gmail.com
UPDATE users 
SET 
    account_locked = false,
    failed_login_attempts = 0,
    email_verified = true
WHERE email = 'manziosee3@gmail.com';

-- Verify the update
SELECT user_id, name, email, role, account_locked, failed_login_attempts, email_verified 
FROM users 
WHERE email = 'manziosee3@gmail.com';
