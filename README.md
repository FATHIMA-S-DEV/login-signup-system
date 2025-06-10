# Revolutie - Authentication System

A modern, responsive authentication system built with React, TypeScript, and Tailwind CSS. Features beautiful sign-up and sign-in pages with local storage authentication.

![Revolutie Preview](https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2)

## 🚀 Live Demo

**Deployed Site:** [https://sunny-platypus-1a3843.netlify.app](https://sunny-platypus-1a3843.netlify.app)

## ✨ Features

- **Modern UI Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all device sizes (mobile, tablet, desktop)
- **Authentication Flow**: Complete sign-up and sign-in functionality
- **Form Validation**: Real-time validation with user-friendly error messages
- **Local Storage**: Persistent user data storage
- **Password Security**: Password strength requirements and visibility toggle
- **Loading States**: Interactive feedback during form submission
- **Success States**: Clear confirmation messages and auto-redirects
- **Google OAuth Ready**: UI components prepared for Google authentication integration

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Code Quality**: ESLint with TypeScript support

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/revolutie-auth.git
cd revolutie-auth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthLayout.tsx      # Main layout wrapper
│   ├── SignIn.tsx          # Sign-in form component
│   └── SignUp.tsx          # Sign-up form component
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
├── index.css              # Global styles and animations
└── vite-env.d.ts          # Vite type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

### Authentication Pages
- **Sign Up**: Collects full name, date of birth, email, and password
- **Sign In**: Email and password authentication with "keep me logged in" option
- **Form Validation**: Real-time validation with helpful error messages
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, and numbers

### UI/UX Elements
- **Smooth Animations**: CSS transitions and loading spinners
- **Responsive Design**: Mobile-first approach with breakpoints
- **Visual Feedback**: Success states, error handling, and loading indicators
- **Accessibility**: Proper form labels, focus states, and keyboard navigation

## 🔐 Authentication Flow

1. **Sign Up Process**:
   - User fills out registration form
   - Form validation ensures data integrity
   - User data is saved to localStorage
   - Success message displayed
   - Auto-redirect to sign-in page

2. **Sign In Process**:
   - User enters credentials
   - System validates against stored data
   - Success: Welcome message and form reset
   - Failure: Clear error message displayed

## 🎯 Form Validation Rules

### Sign Up Validation
- **Full Name**: Minimum 2 characters, required
- **Date of Birth**: Must be at least 13 years old
- **Email**: Valid email format required
- **Password**: Minimum 8 characters, must contain uppercase, lowercase, and number

### Sign In Validation
- **Email**: Valid email format required
- **Password**: Minimum 8 characters required

## 🌐 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## 🚀 Deployment

### Netlify (Recommended)
The project is configured for easy Netlify deployment:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Manual Deployment
```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Google OAuth implementation
- [ ] Password reset functionality
- [ ] Email verification
- [ ] User dashboard
- [ ] Profile management
- [ ] Remember me functionality
- [ ] Multi-factor authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Design inspiration from modern authentication systems
- Icons provided by [Lucide React](https://lucide.dev)
- Images from [Pexels](https://pexels.com)
- Built with [Vite](https://vitejs.dev) and [React](https://reactjs.org)

---

⭐ If you found this project helpful, please give it a star on GitHub!
