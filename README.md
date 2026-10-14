StayFinder AI — Smart Accommodation Discovery Platform

A modern, AI-oriented accommodation discovery frontend that helps users explore PGs, hostels, co-living spaces, and rental properties through intelligent search, location-based discovery, property comparison, and a premium user experience.

Overview

StayFinder AI is a full-stack accommodation discovery platform designed to simplify how students, working professionals, and individuals relocating to new cities find suitable places to stay.

The frontend is built with React.js and Vite, with a premium Burgundy, Beige, and Cream design system. It provides an intuitive interface for discovering properties, filtering search results, viewing property details, saving favorites, comparing accommodations, and managing property listings.

The application communicates with backend REST APIs to support authentication, property management, location services, and role-based functionality.

Key Features

Smart Property Discovery

- Search for PGs, hostels, and co-living spaces by city, area, or property name.
- Filter properties by rent, property type, gender preference, rating, and verification status.
- View property details, amenities, room information, ratings, images, and availability.
- Discover additional properties through location-based search integrations.

Location-Based Experience

- Use browser-based live location when permission is granted.
- Explore properties through map integration.
- View property addresses and location information.
- Support location-oriented property discovery across different cities.

Favorites and Comparison

- Save preferred properties to favorites.
- Compare multiple accommodations before making a decision.
- Retain guest favorites and comparison selections using browser local storage.

User Authentication

- User registration and login interfaces.
- JWT-based authentication integration.
- Protected routes for authenticated features.
- Role-aware navigation and access to appropriate dashboards.

Property Owner Dashboard

- Register as a property owner.
- Add accommodation listings.
- View and manage submitted properties.
- Monitor verification and availability status.

Admin Dashboard

- Review property listings.
- Verify or reject submitted properties.
- Manage property availability.
- Remove listings when required.

Premium UI/UX

- Burgundy, Beige, and Cream visual identity.
- Responsive layouts for desktop, tablet, and mobile.
- Reusable React components and consistent styling.
- Loading indicators, error messages, and empty states.
- AI-inspired recommendation labels and smart discovery interfaces.

«AI capability note: AI-oriented interface elements provide the foundation for future intelligent recommendations. Actual AI recommendations require a connected recommendation service or model.»

Technology Stack

Technology| Purpose
React.js| Component-based user interface
Vite| Frontend development server and build tool
JavaScript (ES6+)| Application logic
HTML5| Application structure
CSS3| Styling and responsive layouts
React Router DOM| Client-side routing
Fetch API| Backend REST API communication
Browser Geolocation API| Current-location access
OpenStreetMap| Location and map-data integration
Local Storage| Guest favorites and comparison persistence
Git and GitHub| Version control and source-code management

Application Architecture

StayFinder AI
│
├── React.js Frontend
│   ├── Home Page
│   ├── Explore Properties
│   ├── Property Details
│   ├── Search and Filters
│   ├── Map View
│   ├── Favorites
│   ├── Property Comparison
│   ├── Login and Registration
│   ├── User Dashboard
│   ├── Owner Dashboard
│   └── Admin Dashboard
│
├── REST API Integration
│   ├── Authentication
│   ├── Property Management
│   ├── Favorites
│   ├── Reviews
│   ├── Location Search
│   └── Administrative Operations
│
└── Backend Services
    ├── Java
    ├── Spring Boot
    ├── Spring Security and JWT
    └── PostgreSQL

Getting Started

Prerequisites

Install the following software:

- Node.js (LTS version recommended)
- npm
- Git
- Visual Studio Code or another code editor

The Spring Boot backend and PostgreSQL database are required for features that depend on server-side data.

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual repository URL.

2. Navigate to the Frontend

cd StayFinder/frontend

Adjust the folder path if your repository has a different structure.

3. Install Dependencies

npm install

4. Start the Development Server

npm run dev

5. Open the Application

Open the local URL displayed in your terminal. With the default Vite configuration, it is usually:

http://localhost:5173

Backend Configuration

The frontend currently uses the local Spring Boot API:

http://localhost:8080

The API base URL is configured in the frontend source code. For production, configure the backend URL using a Vite environment variable.

Create a ".env" file inside the "frontend" folder:

VITE_API_BASE_URL=http://localhost:8080

Update the API configuration in the application to read:

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

Restart the Vite development server after changing environment variables.

Important: Never store database passwords, JWT signing secrets, or other private backend credentials in frontend environment variables. Variables prefixed with "VITE_" are exposed to browser code.

Available Scripts

Command| Description
"npm run dev"| Start the development server
"npm run build"| Create a production build
"npm run preview"| Preview the production build locally

Run a production build before deployment:

npm run build

The generated production files are normally placed in the "dist/" directory.

Design System

StayFinder AI uses a consistent premium visual theme.

Design Element| Color
Primary Burgundy| "#6B1E2E"
Dark Burgundy| "#42121D"
Light Burgundy| "#8B3A4A"
Primary Beige| "#D8C3A5"
Light Beige| "#EDE1D0"
Cream Background| "#F8F3EA"
White| "#FFFFFF"
Main Text| "#2B2020"
Muted Text| "#766A63"

The design system aims to maintain a consistent appearance across search pages, property cards, dashboards, forms, and navigation components.

Security and Data Handling

- Authentication is integrated with the backend using JWT tokens.
- Protected frontend routes improve navigation and user experience but do not replace backend authorization.
- Backend endpoints must enforce authentication, role permissions, and ownership checks.
- Guest favorites and comparison selections can be stored in browser local storage.
- Browser geolocation requires user permission.
- Production deployments should use HTTPS and appropriately configured CORS policies.

Future Enhancements

- AI-powered personalized accommodation recommendations.
- Natural-language property search and conversational assistance.
- Intelligent property ranking based on budget and preferences.
- Advanced geospatial search for nearby properties.
- Online booking and payment integration.
- Real-time notifications and enquiry management.
- Automated testing and frontend performance optimization.
- Docker-based deployment and CI/CD integration.
- Production deployment with environment-specific configuration.

Project Goals

StayFinder AI demonstrates practical frontend engineering skills, including:

- React component-based architecture.
- Responsive interface development.
- Client-side routing and protected navigation.
- REST API integration.
- Authentication workflows.
- Search, filtering, and state management.
- Browser geolocation and map integration.
- Reusable styling and design systems.
- Integration with a Java Spring Boot backend.

StayFinder AI
Discover smarter. Compare better. Find your place.
