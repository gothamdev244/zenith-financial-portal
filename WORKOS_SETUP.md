# WorkOS Authentication Setup Guide

This guide will help you set up WorkOS authentication for the Zenith Financial Portal.

## Step 1: Create a WorkOS Account

1. Go to [https://workos.com/](https://workos.com/)
2. Sign up for a free account
3. Verify your email

## Step 2: Create an Application

1. Log into the [WorkOS Dashboard](https://dashboard.workos.com/)
2. Click "Create Application"
3. Name it "Zenith Financial Portal"
4. Note down your **API Key** and **Client ID**

## Step 3: Configure Redirect URI

1. In your WorkOS application settings, go to "Redirect URIs"
2. Add the following URIs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://your-domain.com/api/auth/callback`

## Step 4: Enable Authentication Methods

1. Go to "Authentication" in your WorkOS application
2. Enable the following methods:
   - **Email/Password** (recommended for clients)
   - **Magic Link** (passwordless option)
   - **Google OAuth** (social login)
   - **Microsoft OAuth** (enterprise SSO)

## Step 5: Configure Environment Variables

Update your `.env.local` file with your WorkOS credentials:

```bash
# Get these from https://dashboard.workos.com/
WORKOS_API_KEY="sk_test_YOUR_ACTUAL_API_KEY"
WORKOS_CLIENT_ID="client_YOUR_ACTUAL_CLIENT_ID"
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
WORKOS_COOKIE_PASSWORD="generate-a-random-32-character-string"
```

### Generate Cookie Password

You can generate a secure cookie password with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000/login](http://localhost:3000/login)

3. Try logging in with:
   - Email/Password authentication
   - Google OAuth
   - Microsoft OAuth

## Step 7: User Management

### Default Users

The system comes with pre-configured test users in the database:

```
Admin:
- Email: admin@zenithfinancial.com
- Role: admin

Advisors:
- Email: john.advisor@zenithfinancial.com
- Email: sarah.advisor@zenithfinancial.com
- Role: advisor

Clients:
- Email: michael.client@email.com
- Email: emily.client@email.com
- Email: david.client@email.com
- Role: client
```

### Creating New Users

New users can be created in two ways:

1. **Through WorkOS Dashboard**: Create users manually
2. **Self-Registration**: Users can sign up through the login page

When a new user logs in for the first time:
- They are automatically created in the database
- Default role is `client`
- Admins can change roles in the admin dashboard (coming soon)

## Production Deployment

### Environment Variables

For production, update these environment variables:

```bash
NODE_ENV="production"
WORKOS_API_KEY="sk_prod_YOUR_PRODUCTION_API_KEY"
WORKOS_CLIENT_ID="client_YOUR_PRODUCTION_CLIENT_ID"
WORKOS_REDIRECT_URI="https://your-domain.com/api/auth/callback"
WORKOS_COOKIE_PASSWORD="super-secret-32-character-production-key"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Security Checklist

- [ ] Use production WorkOS API keys
- [ ] Generate new secure cookie password
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Enable MFA for admin accounts
- [ ] Configure session timeout
- [ ] Review WorkOS security settings

## Troubleshooting

### "Authentication failed" error

- Verify your API keys are correct
- Check that redirect URI matches exactly
- Ensure WorkOS application is active

### Session not persisting

- Check cookie password length (must be 32+ characters)
- Verify secure cookies in production
- Check browser cookie settings

### Role-based access not working

- Verify user role in database
- Check middleware configuration
- Review route protection rules

## Resources

- [WorkOS Documentation](https://workos.com/docs)
- [WorkOS User Management Guide](https://workos.com/docs/user-management)
- [Next.js Integration](https://workos.com/docs/integrations/next-js)
- [Security Best Practices](https://workos.com/docs/security)

## Support

For WorkOS-specific issues:
- [WorkOS Support](https://workos.com/support)
- [Community Slack](https://workos.com/slack)

For portal-specific issues:
- Create an issue on GitHub
- Contact your development team
