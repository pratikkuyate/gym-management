# Gym Management Application

This is a **Gym Management** application built with Next.js, Prisma, and NextAuth.js. It provides user authentication, member management, and dashboard functionalities to efficiently manage gym operations.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

### User Authentication
- Sign Up and Login pages using **NextAuth.js**
- Password encryption with **bcryptjs**

### Member Management
- Add, edit, and view member details
- Dynamic routing for member profiles

### Protected Routes
- Access control for authenticated users

### Responsive Design
- Built with **Reactstrap** and **Bootstrap**

### Database Integration
- Uses **Prisma** ORM with a **PostgreSQL** database

## Prerequisites
- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)
- **PostgreSQL** database

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/gym-management.git
cd gym-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
   - Ensure you have a PostgreSQL database running
   - Create a database for the application
   - Update the `DATABASE_URL` in the .env file with your database connection string:
   ```
   DATABASE_URL="postgres://username:password@localhost:5432/gym-management"
   ```

4. **Run Prisma migrations**
```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma client**
```bash
npx prisma generate
```

6. **Set up environment variables**
   - Create a .env file in the root directory
   - Add the required environment variables:
   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```
   - Replace `your-database-url` with your actual database URL
   - Replace `your-nextauth-secret` with a secret key (you can generate one using `openssl rand -base64 32`)

## Project Structure
```
.
├── .env
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── prisma
│   ├── migrations
│   └── schema.prisma
├── public
├── README.md
├── src
│   ├── components
│   │   └── Layout
│   │       ├── index.tsx
│   │       └── NavBar.tsx
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts
│   │   │   └── signup.tsx
│   │   ├── dashboard.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── members
│   │   │   ├── [mid].tsx
│   │   │   └── add.tsx
│   │   └── signup.tsx
│   ├── styles
│   │   ├── globals.css
│   │   └── Home.module.css
│   └── utils
├── tsconfig.json
```

## Environment Variables

The application relies on the following environment variables:

- `DATABASE_URL`: The connection string for your PostgreSQL database
- `NEXTAUTH_URL`: The base URL of your application (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js (used to sign tokens)

## Usage

1. **Run the development server**
```bash
npm run dev
```

2. **Open the application**
   - Navigate to http://localhost:3000 in your browser

3. **Access the features**
   - **Sign Up**: Create a new account at `/signup`
   - **Login**: Log in with your credentials at `/login`
   - **Dashboard**: Access the dashboard at `/dashboard` (available after login)
   - **Manage Members**: Add or edit members at `/members`

## Scripts

- `npm run dev`: Runs the application in development mode
- `npm run build`: Builds the application for production
- `npm run start`: Starts the application in production mode
- `npm run lint`: Runs ESLint to check for code linting issues
