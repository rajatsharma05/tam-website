# TAM Events - Event Management Platform

A comprehensive event management system with Firebase authentication, QR code registration, email confirmations, and Excel export functionality.

## Features

- 🔐 **Firebase Authentication** - Secure user login and registration
- 📅 **Event Management** - Create, edit, and manage events
- 🎫 **QR Code Registration** - Unique QR codes for each registration
- 📧 **Email Confirmations** - Automatic email with QR code
- 📊 **Admin Panel** - Manage events and view registrations
- 📈 **Excel Export** - Automatic Excel generation for check-ins
- 📱 **Responsive Design** - Works on all devices
- 🛡️ **Security Features** - Input validation, error handling, and secure practices

## Recent Security Improvements

### High Priority Fixes Implemented:
- ✅ **Removed hardcoded admin credentials** from UI
- ✅ **Added comprehensive input validation** for all API endpoints
- ✅ **Improved error handling** with proper error messages
- ✅ **Enhanced type safety** by removing `any` types
- ✅ **Added loading states** throughout the application
- ✅ **Implemented proper timestamp handling** for Firestore data
- ✅ **Added utility functions** for validation and error handling

### Security Features:
- Input validation for QR codes, emails, and form data
- Proper error handling with user-friendly messages
- Type-safe operations with TypeScript
- Secure API endpoints with validation
- Loading states to prevent duplicate submissions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Email**: Nodemailer
- **QR Codes**: qrcode library
- **Excel**: xlsx library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase config and create `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Users
1. **Sign Up/Login** - Create an account or sign in
2. **Browse Events** - View available events
3. **Register** - Click on an event to register
4. **Get QR Code** - Receive email with QR code
5. **Attend Event** - Present QR code at entrance

### For Admins
1. **Admin Access** - Login with admin credentials (contact system administrator)
2. **Manage Events** - Add, edit, or delete events
3. **View Registrations** - See all event registrations
4. **Check-in System** - Use QR codes for check-in
5. **Excel Export** - Download check-in data

### For Event Staff
1. **Check-in Page** - Visit `/checkin`
2. **Scan QR Codes** - Enter or scan QR codes
3. **Confirm Check-in** - Verify attendee details
4. **Download Excel** - Get attendance reports

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Event pages
│   ├── admin/             # Admin panel
│   └── checkin/           # Check-in system
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── lib/                   # Utilities and services
│   ├── firebase.ts        # Firebase configuration
│   ├── email.ts           # Email service
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript definitions
```

## API Endpoints

- `POST /api/checkin` - Process QR code check-ins
- `POST /api/send-email` - Send registration confirmation emails
- Both endpoints include comprehensive input validation and error handling

## Database Collections

### Events
```typescript
{
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registeredCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Registrations
```typescript
{
  id: string
  eventId: string
  eventName: string
  registrantName: string
  email: string
  phone: string
  qrCode: string
  isCheckedIn: boolean
  checkInTime?: Date
  createdAt: Date
}
```

### Checkins
```typescript
{
  id: string
  eventId: string
  eventName: string
  registrantName: string
  email: string
  phone: string
  qrCode: string
  checkInTime: Date
  isCheckedIn: boolean
  createdAt: Date
}
```

## Security Features

### Input Validation
- Email format validation
- QR code format and length validation
- String length limits
- Required field validation

### Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- User-friendly error display
- Graceful failure handling

### Type Safety
- Full TypeScript implementation
- Proper type definitions
- No `any` types in critical paths
- Type-safe API responses

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Set environment variables
- Build: `npm run build`
- Start: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
