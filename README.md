# 🍽️ Sea Catering - Healthy Meal Delivery Service

A modern web application for a meal delivery service built with Next.js, featuring user authentication, subscription management, and admin functionality.

## 🌟 Features

- **User Authentication**: Secure login/register system with NextAuth.js
- **Meal Plans**: Browse and subscribe to various healthy meal plans
- **Subscription Management**: Users can manage their meal subscriptions
- **Admin Dashboard**: Administrative interface for managing users and subscriptions
- **Testimonials**: Customer reviews and feedback system
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Security**: Built-in CSRF protection and rate limiting

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Library**: HeroUI (NextUI-based components)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with JWT
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, DOMPurify, bcryptjs for password hashing
- **Validation**: Express Validator

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- PostgreSQL database

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/seacatering_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

### Environment Variables Explanation:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: The canonical URL of your site (use your domain in production)
- `NEXTAUTH_SECRET`: A random string used to hash tokens, sign cookies and generate cryptographic keys

## 🛠️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/seacatering.git
   cd seacatering
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate deploy

   # Seed the database with initial data
   npm run prisma:seed
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

This application uses PostgreSQL as the database. The Prisma schema includes the following main models:

- **User**: Customer and admin accounts
- **Account/Session**: NextAuth.js authentication tables
- **MealPlan**: Available meal subscription plans
- **Subscription**: User meal subscriptions
- **Testimonial**: Customer reviews

### Database Migration Commands:

```bash
# Create and apply a new migration
npx prisma migrate dev --name migration_name

# Reset the database (⚠️ This will delete all data)
npx prisma migrate reset

# View your data in Prisma Studio
npx prisma studio
```

## 👑 Admin Account Setup

The application includes admin functionality for managing users, subscriptions, and meal plans.

### Creating an Admin Account:

1. **Using the Database Seed (Recommended):**
   The seed script automatically creates an admin account with the following credentials:

   - **Email**: `admin@seacatering.com`
   - **Password**: `password123`
   - **Role**: `ADMIN`

   Run the seed command:

   ```bash
   npm run prisma:seed
   ```

2. **Manual Database Setup:**
   If you prefer to create an admin account manually, you can use Prisma Studio or direct database access:

   ```bash
   npx prisma studio
   ```

   Then create a user with `role: "ADMIN"` and a bcrypt-hashed password.

3. **Through Registration (Requires Code Modification):**
   You can temporarily modify the registration API to allow admin role assignment, or create a special admin registration endpoint.

### Admin Features:

- View all users and their subscriptions
- Manage meal plans
- View subscription analytics
- Access protected admin routes at `/admin`

⚠️ **Security Note**: Remember to change the default admin password in production!

## 🏃‍♂️ Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build the application for production
npm start           # Start production server

# Database
npm run prisma:seed # Seed database with initial data

# Code Quality
npm run lint        # Run ESLint with auto-fix
```

## 📁 Project Structure

```
seacatering/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── contact/           # Contact page
│   ├── menu/              # Menu/meal plans page
│   └── subscribe/         # Subscription page
├── components/            # Reusable React components
├── config/               # Configuration files
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # Global CSS styles
└── types/                # TypeScript type definitions
```

## 🔐 Authentication & Security

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure session management with NextAuth.js
- **CSRF Protection**: Built-in CSRF token validation
- **Rate Limiting**: Express rate limiting for API endpoints
- **Input Sanitization**: DOMPurify for XSS prevention
- **Helmet**: Security headers configuration

## 🌐 Deployment

### Vercel (Recommended):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment:

1. Build the application:

   ```bash
   npm run build
   ```

2. Set up your production database and update `DATABASE_URL`

3. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help setting up the application, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Coding! 🚀**

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
