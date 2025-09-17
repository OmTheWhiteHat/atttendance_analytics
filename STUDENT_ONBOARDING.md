# Student Onboarding Flow Documentation

## Overview
The AttendRight system now includes a comprehensive student onboarding flow that integrates Clerk authentication with your custom student database. After students register with Clerk, they are prompted to fill in additional academic information before accessing their dashboard.

## 🔄 Complete Flow

### 1. Student Registration
- Student visits `/student/sign-up`
- Registers using Clerk (email, social login, etc.)
- **Automatically redirected to** `/student/onboarding`

### 2. Onboarding Process
- Student fills out comprehensive form with:
  - **Personal Info**: Roll Number, Registration Number, Phone
  - **Academic Info**: Year, Branch, Section  
  - **Emergency Contact**: Parent/Guardian phone, Address
- Data is validated on both frontend and backend
- **Automatically creates student record in MongoDB**
- **Updates Clerk metadata** to mark onboarding as complete
- **Redirects to** `/student/dashboard`

### 3. Dashboard Access
- Dashboard checks if onboarding is complete
- If not complete → redirects to onboarding
- If complete → shows full dashboard with attendance tracking

## 📋 Data Collected During Onboarding

### Personal Information
- **Roll Number** (e.g., 21CS001) - Required, Unique
- **Registration Number** (e.g., 2021001234) - Required, Unique  
- **Phone Number** - Required
- **Address** - Optional

### Academic Information
- **Year** (1st-4th) - Required
- **Branch/Department** - Required (Dropdown with common branches)
- **Section** (A-D) - Optional

### Emergency Contact
- **Parent/Guardian Phone** - Required

### Auto-Generated Fields
- **Student ID**: `STU_{timestamp}_{rollNumber}` (for legacy compatibility)
- **Clerk User ID**: Links to Clerk authentication
- **Email**: From Clerk account
- **Full Name**: From Clerk account

## 🗃️ Database Schema

### Updated Student Model
```javascript
{
  // Clerk Integration
  clerkUserId: String (required, unique),
  
  // Personal Information  
  email: String (required, unique),
  firstName: String (required),
  lastName: String,
  fullName: String (required),
  phoneNumber: String (required),
  address: String,
  
  // Academic Information
  rollNumber: String (required, unique),
  registrationNumber: String (required, unique), 
  year: Number (1-4, required),
  branch: String (required),
  section: String,
  
  // Emergency Contact
  parentPhoneNumber: String (required),
  
  // Legacy/Compatibility
  user: ObjectId (ref: 'User'),
  studentId: String,
  
  // Attendance & Gamification
  attendance: [ObjectId],
  attendanceScore: Number (default: 0),
  dailyStreak: Number (default: 0),
  
  // Status
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Student Onboarding
```
POST /api/student/onboard
```
**Body:**
```json
{
  "clerkUserId": "user_abc123",
  "email": "student@example.com", 
  "firstName": "John",
  "lastName": "Doe",
  "rollNumber": "21CS001",
  "registrationNumber": "2021001234",
  "year": 2,
  "branch": "Computer Science Engineering", 
  "section": "A",
  "phoneNumber": "+91 9876543210",
  "parentPhoneNumber": "+91 9876543211",
  "address": "123 Main St, City"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student onboarding completed successfully",
  "student": {
    "_id": "65f...",
    "clerkUserId": "user_abc123",
    "fullName": "John Doe", 
    "rollNumber": "21CS001",
    "year": 2,
    "branch": "Computer Science Engineering",
    "section": "A"
  }
}
```

### Get Student Profile  
```
GET /api/student/profile/:clerkUserId
```

## 🔒 Authentication & Security

### Frontend Protection
- **Onboarding page**: Protected by Clerk auth
- **Dashboard**: Checks both Clerk auth AND onboarding completion
- **Automatic redirects**: Prevents accessing dashboard without onboarding

### Backend Protection  
- **Onboarding endpoint**: Public (but validates Clerk user ID)
- **Profile endpoint**: Protected by JWT middleware
- **Data validation**: Comprehensive validation on all required fields
- **Duplicate prevention**: Checks for existing roll numbers, emails, etc.

## 🎯 User Experience

### For New Students
1. Sign up with Clerk (easy, social login support)
2. Complete one-time academic profile setup
3. Access full dashboard with attendance tracking

### For Returning Students  
1. Sign in with Clerk
2. Automatically go to dashboard (onboarding already complete)
3. All academic info already saved

## 🚀 Benefits

✅ **Seamless Integration**: Clerk auth + custom student data  
✅ **One-time Setup**: Students only fill info once  
✅ **Complete Validation**: Prevents duplicate roll numbers, etc.  
✅ **Automatic Flow**: Smart redirects based on completion status  
✅ **Rich Data**: All academic info needed for attendance system  
✅ **Emergency Contacts**: Parent/guardian info for notifications  

## 🔧 Development Notes

### Frontend Components
- `/student/sign-up/page.js` - Clerk registration
- `/student/onboarding/page.js` - Academic info collection
- `/student/dashboard/page.js` - Protected dashboard with checks
- `/student/layout.js` - Clerk provider for student routes

### Backend Components  
- `models/Student.js` - Updated schema with all new fields
- `controllers/studentController.js` - Onboarding logic
- `routes/studentRoutes.js` - Public onboarding endpoint

### Environment Configuration
- Clerk redirects updated to use onboarding flow
- API endpoints configured for student data

## 🧪 Testing the Flow

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`  
3. **Test Registration**:
   - Go to `/student/sign-up`
   - Create account with Clerk
   - Should redirect to `/student/onboarding`
4. **Test Onboarding**:
   - Fill out academic information form
   - Should save to database and redirect to dashboard
5. **Test Return Flow**:
   - Sign out and sign back in
   - Should go directly to dashboard (onboarding complete)

Your student onboarding system is now fully functional! 🎉