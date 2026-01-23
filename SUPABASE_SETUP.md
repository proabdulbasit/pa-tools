# Supabase Setup for Sample Signup (No Email Verification)

To disable email sending/verification for signup:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: **Authentication** → **Providers** → **Email**
4. Toggle OFF **"Confirm email"**
5. Save changes

After this, users will be automatically signed in after signup without needing to verify their email.

**Note:** This is useful for development/testing. For production, consider keeping email verification enabled for security.
