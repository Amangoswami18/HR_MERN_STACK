# Quick Setup Guide - HR Management System

## 🚀 Quick Start (5 Minutes)

### Step 1: Extract the ZIP file
```bash
unzip hr-management-system.zip
cd hr-management-system
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Linux/Mac
sudo service mongod start
# OR
brew services start mongodb-community
```

### Step 3: Backend Setup
```bash
cd backend
npm install
npm run seed      # Creates admin user
npm run dev       # Starts backend on port 5000
```

### Step 4: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev       # Starts frontend on port 3000
```

### Step 5: Open Browser
## Login Credentials

### Admin Account
- Email: `admin@hr.com`
- Password: `admin123`

### Test Employee (Create by registering)
- Click "Create an account" on login page
- Fill in details and register

## Verification Checklist

After setup, verify these features:

### As Employee:
1. ✓ Register new account
2. ✓ Login successfully
3. ✓ View dashboard with statistics
4. ✓ Apply for leave
5. ✓ Mark attendance
6. ✓ View leave and attendance history

### As Admin:
1. ✓ Login with admin credentials
2. ✓ View admin dashboard
3. ✓ See pending leave requests
4. ✓ Approve/Reject leaves
5. ✓ View all attendance records
6. ✓ See employee list

##  Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongooseServerSelectionError`
**Solution:** 
- Make sure MongoDB is running
- Check connection string in `backend/.env`

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`
**Solution:** 
- Change PORT in `backend/.env` to different port (e.g., 5001)
- Update VITE_API_URL in `frontend/.env` accordingly

### Issue 3: CORS Error
**Error:** `CORS policy blocked`
**Solution:**
- Make sure backend is running
- Check VITE_API_URL in frontend/.env matches backend URL

### Issue 4: npm install fails
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Run `npm install` again

## Testing the Application

### Test Scenario 1: Employee Leave Request
1. Register as employee
2. Go to "Apply Leave"
3. Select dates and type
4. Submit request
5. Check "My Leaves" to see pending status
6. Login as admin
7. Approve the leave
8. Login back as employee
9. Check leave balance decreased

### Test Scenario 2: Attendance Marking
1. Login as employee
2. Go to "Mark Attendance"
3. Select today's date
4. Mark as "Present"
5. Check "My Attendance" for record
6. Login as admin
7. View attendance in admin panel

## 🔧 Environment Variables

##  Database Seeding

The seed script creates:
- 1 Admin user (admin@hr.com / admin123)

To re-seed:
```bash
cd backend
npm run seed
```

## Next Steps

1. **Change Admin Password** - Login and update in production
2. **Add More Features** - Email notifications, reports, etc.
3. **Deploy** - Use Vercel (frontend) + Render/Railway (backend)
4. **Testing** - Add unit and integration tests

## Tips

- Keep both terminal windows open (backend & frontend)
- Use different browsers to test employee and admin roles
- Check browser console for any errors
- Use MongoDB Compass to view database

##  Support

If you face any issues:
1. Check console logs in browser (F12)
2. Check terminal logs for backend
3. Verify MongoDB is running
4. Ensure all environment variables are set

---

**Project Ready!** You can now test all features of the HR Management System.
**BY Aman Goswami!**