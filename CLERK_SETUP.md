# Clerk Integration Setup Instructions

## Overview
Your AttendRight project now has **hybrid authentication**:
- **Students**: Use Clerk for easy authentication (social logins, magic links, etc.)
- **Teachers & Admins**: Use traditional JWT authentication for controlled access

## 🔧 Setup Steps

### 1. Get Your Clerk API Keys
1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. In your Clerk dashboard, go to **API Keys**
4. Copy your **Publishable Key** and **Secret Key**

### 2. Update Environment Variables
Edit `frontend/.env.local` and replace the placeholder values:

```env
# Replace with your actual Clerk keys from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# These are already configured correctly
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/student/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/student/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/student/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/student/dashboard
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Configure Clerk Dashboard
In your Clerk dashboard:

1. **Authentication Methods**: 
   - Enable Email/Password
   - Optionally enable Google, GitHub, etc. for students

2. **Redirect URLs**:
   - Sign-in redirect: `http://localhost:3000/student/dashboard`
   - Sign-up redirect: `http://localhost:3000/student/dashboard`

3. **Allowed redirect URLs**:
   - Add: `http://localhost:3000/student/dashboard`
   - Add: `http://localhost:3000/student/sign-in`
   - Add: `http://localhost:3000/student/sign-up`

## 🚀 Current Authentication Routes

### Students (Clerk-based)
- **Sign In**: `/student/sign-in` 
- **Sign Up**: `/student/sign-up`
- **Dashboard**: `/student/dashboard` (protected)

### Teachers (Traditional JWT)
- **Login**: `/teacher/login`
- **Dashboard**: `/teacher/dashboard` (to be created)

### Admins (Traditional JWT)
- **Login**: `/admin/login` 
- **Dashboard**: `/admin/dashboard` (to be created)

## 🔒 How It Works

### Student Flow
1. Student visits `/student/sign-in`
2. Uses Clerk's beautiful UI for authentication
3. After sign-in, redirected to `/student/dashboard`
4. Student data is managed by Clerk
5. Access attendance features, QR scanning, etc.

### Teacher/Admin Flow
1. Teacher/Admin visits `/teacher/login` or `/admin/login`
2. Uses traditional email/password form
3. Validated against your MongoDB database
4. JWT token stored for subsequent requests
5. Role-based access control enforced

## 📝 Current Status

✅ **Frontend errors FIXED** - No more authMiddleware or API key errors  
✅ **Teacher/Admin routes work** - Can access `/teacher/login` and `/admin/login`  
⚠️ **Student routes need Clerk setup** - Will show setup message until configured  
✅ **Graceful fallbacks** - App works even without Clerk configured  

## 🎆 Next Steps

1. **Replace Clerk keys** in `frontend/.env.local`
2. **Test student authentication** - try signing up a student
3. **Create teacher/admin accounts** in your database
4. **Test traditional auth** - try logging in as teacher/admin
5. **Build teacher/admin dashboards** as needed

## 📝 Benefits of This Hybrid Approach

✅ **Students**: Modern, easy authentication with social logins  
✅ **Staff**: Controlled access through your own user management  
✅ **Security**: Role-based access control  
✅ **Scalability**: Clerk handles student scaling  
✅ **Flexibility**: Different UX for different user types  

## 🐛 Troubleshooting

### "authMiddleware is not a function" Error
✅ **FIXED**: Updated to use the new Clerk middleware syntax

### "Invalid API Key" Error  
✅ **HANDLED**: The app will show a setup message if keys aren't configured
- Make sure you've replaced the placeholder keys in `.env.local`
- Ensure the keys start with `pk_test_` and `sk_test_` respectively
- Get real keys from https://dashboard.clerk.com

### Student Routes Not Working
- If you see a "Clerk Setup Required" message, you need to add real API keys
- The app will still work for teacher/admin routes without Clerk configured

### Student Dashboard Not Loading
- Check if Clerk keys are properly configured
- Verify allowed redirect URLs in Clerk dashboard

### Teacher/Admin Login Issues  
- Ensure backend server is running on port 5000
- Check if MongoDB is running and connected
- Verify user exists in database with correct role

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`  
3. **Test Routes**:
   - Student: `http://localhost:3000/student/sign-in`
   - Teacher: `http://localhost:3000/teacher/login`
   - Admin: `http://localhost:3000/admin/login`

Your hybrid authentication system is ready to go! 🎉