# SchemaFlow - Headless CMS Frontend

A modern, user-friendly frontend application for SchemaFlow, a powerful headless Content Management System built with React and TypeScript.

## 🚀 Features

### Public Features
- **Landing Page** - Marketing page with product information, documentation overview, and pricing plans
- **Authentication** - Secure login and registration system

### Protected Dashboard Features
- **Dashboard Overview** - Quick access to content types and recent activity
- **Schema Builder** - Visual interface to create and manage content type schemas
- **Content Types Management**
  - List all content types
  - Create new content types
  - Edit existing content types
- **Content Manager**
  - View all entries for each content type
  - Create new content entries
  - Edit existing entries
- **Settings** - Configure API keys and application settings
- **Documentation** - Built-in API documentation and usage guides

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: JWT-based authentication
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- A running instance of the SchemaFlow backend API

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "CMaaS frontend/CMaaS.Frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL=https://localhost:7176

# Cloudinary Configuration (if using image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
```

4. Update the backend URL in `.env` to match your API server

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx    # Authentication guard for protected routes
│   │   └── PublicRoute.tsx       # Redirect authenticated users from auth pages
│   └── layout/
│       └── DashboardLayout.tsx   # Main dashboard layout with sidebar
├── lib/
│   ├── auth.ts                   # Authentication utilities and user management
│   └── axios.ts                  # Axios instance with interceptors
├── pages/
│   ├── auth/
│   │   ├── Login.tsx             # Login page
│   │   └── Register.tsx          # Registration page
│   ├── Entity/
│   │   ├── ContentEntries.tsx    # List all entries for a content type
│   │   ├── ContentEntryCreate.tsx # Create new entry
│   │   └── ContentEntryEdit.tsx  # Edit existing entry
│   ├── Type/
│   │   ├── ContentTypesList.tsx  # List all content types
│   │   ├── ContentTypeCreate.tsx # Create content type (legacy)
│   │   ├── ContentTypeEdit.tsx   # Edit content type
│   │   └── SchemaBuilder.tsx     # Visual schema builder
│   ├── DashboardHome.tsx         # Dashboard home page
│   ├── Documentation.tsx         # API documentation
│   ├── LandingPage.tsx           # Public landing page
│   └── Settings.tsx              # App settings
├── App.tsx                       # Main app component with routing
└── main.tsx                      # Application entry point
```

## 🗺️ Application Routes

### Public Routes
- `/` - Landing page (accessible by everyone)
- `/login` - User login
- `/register` - Company/user registration

### Protected Routes (require authentication)
All protected routes are prefixed with `/app`:

- `/app/dashboard` - Dashboard home
- `/app/schema-builder` - Create content types visually
- `/app/content-types` - List all content types
- `/app/content-types/create` - Create new content type
- `/app/content-types/edit/:id` - Edit content type
- `/app/content-manager/:contentTypeId` - View entries for a content type
- `/app/content-manager/:contentTypeId/create` - Create new entry
- `/app/content-manager/:contentTypeId/edit/:entryId` - Edit entry
- `/app/settings` - Application settings
- `/app/documentation` - API documentation

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Registration**: Users create an organization account with admin credentials
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: `ProtectedRoute` component guards protected pages
5. **Public Routes**: `PublicRoute` component redirects authenticated users to dashboard

## 🌐 API Integration

### Base URL Configuration
The API base URL is configured via the `VITE_BACKEND_URL` environment variable.

### API Endpoints Used

#### Authentication
- `POST /api/Auth/register-company` - Register new organization
- `POST /api/Auth/login` - User login

#### Content Types
- `GET /api/ContentTypes` - List all content types
- `POST /api/ContentTypes` - Create content type
- `PUT /api/ContentTypes/{id}` - Update content type
- `DELETE /api/ContentTypes/{id}` - Delete content type

#### Content Entries
- `GET /api/ContentEntries/{contentTypeId}` - List entries
- `POST /api/ContentEntries` - Create entry
- `PUT /api/ContentEntries/{id}` - Update entry
- `DELETE /api/ContentEntries/{id}` - Delete entry

#### Delivery API (Public)
- `GET /api/Delivery/{contentTypeName}` - Fetch all entries by content type name
- `GET /api/Delivery/{contentTypeName}/{id}` - Fetch specific entry by ID

## 🎨 Styling

The project uses Tailwind CSS with a custom configuration:

### Custom Colors
- **Primary**: Blue theme color (#2563eb)
- **Background**: Light gray (#f9fafb)
- **Surface**: White (#ffffff)
- **Dark**: Gray-900 (#111827)

### Responsive Design
All pages are fully responsive with mobile-first approach using Tailwind's responsive utilities.

## 🔄 State Management

The application uses React's built-in state management:
- **useState** for local component state
- **useEffect** for side effects and data fetching
- **useNavigate/useLocation** for routing state
- **Custom hooks** in lib/auth.ts for user management

## 🚧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React functional component patterns
- Use hooks for state and lifecycle management
- Keep components focused and reusable

### Component Organization
- **Pages**: Full-page components in `src/pages/`
- **Components**: Reusable components in `src/components/`
- **Utilities**: Helper functions in `src/lib/`

### Naming Conventions
- Components: PascalCase (e.g., `ContentTypesList.tsx`)
- Utilities: camelCase (e.g., `auth.ts`)
- CSS classes: Tailwind utility classes

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port (5174, 5175, etc.)

### CORS Issues
Ensure your backend API has CORS configured to allow requests from `http://localhost:5173`

### Authentication Issues
- Check that `VITE_BACKEND_URL` is correctly set in `.env`
- Verify the backend API is running
- Clear localStorage and try logging in again

