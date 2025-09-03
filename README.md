Mazao ERP - Agricultural Management System 🌱
=============================================

A modern, full-stack web application for managing farmers and crops in the agricultural sector. Built with React, Node.js, Express, and PostgreSQL.

[https://img.shields.io/badge/Status-Production\_Ready-green](https://img.shields.io/badge/Status-Production_Ready-green) [https://img.shields.io/badge/React-18.2-blue](https://img.shields.io/badge/React-18.2-blue) [https://img.shields.io/badge/Node.js-18+-green](https://img.shields.io/badge/Node.js-18+-green) [https://img.shields.io/badge/PostgreSQL-15-blue](https://img.shields.io/badge/PostgreSQL-15-blue)

🌟 Features
-----------

### 👥 User Management

*   **Role-based Authentication** (Admin/Farmer)
    
*   **User Profiles** with contact information
    
*   **Secure JWT-based authentication**
    
*   **Profile management system**
    

### 🌾 Crop Management

*   **Complete CRUD operations** for crops
    
*   **Crop status tracking** (Planted, Harvested, Sold)
    
*   **Crop categorization** by type (Cereal, Vegetable, Legume, etc.)
    
*   **Quantity and harvest date management**
    

### 📊 Dashboard & Analytics

*   **Interactive charts** showing crops distribution
    
*   **Real-time statistics** for farmers and crops
    
*   **Crop status overview** with visual indicators
    
*   **Responsive design** for all devices
    

### 🎨 Modern UI/UX

*   **Clean, intuitive interface** inspired by Kenyan agriculture
    
*   **Responsive design** that works on desktop and mobile
    
*   **Loading states** and smooth animations
    
*   **Toast notifications** for user feedback
    

🚀 Live Demo
------------

*   **Frontend Application**: [https://mazao-erp.netlify.app](https://mazao-erp.netlify.app)
    
*   **Backend API**: [https://mazao-erp-api.onrender.com](https://mazao-erp-api.onrender.com)
    

### Demo Credentials

**Admin Account:**

*   Email: admin@shamba.com
    
*   Password: Admin123#
    

**Farmer Accounts:**

*   Email: wanjiku@shamba.com
    
*   Password: Farmer123#
    
*   Email: kamau@shamba.com
    
*   Password: Farmer123#
    

🛠️ Technology Stack
--------------------

### Frontend

*   **React 18** with TypeScript
    
*   **Vite** for fast development builds
    
*   **Tailwind CSS** for styling
    
*   **Recharts** for data visualization
    
*   **React Router** for navigation
    
*   **Lucide React** for icons
    

### Backend

*   **Node.js** with Express.js
    
*   **PostgreSQL** with Prisma ORM
    
*   **JWT** for authentication
    
*   **bcryptjs** for password hashing
    
*   **CORS** enabled for cross-origin requests
    

### Deployment

*   **Frontend**: Netlify
    
*   **Backend**: Render
    
*   **Database**: PostgreSQL on Render
    

📦 Installation & Setup
-----------------------

### Prerequisites

*   Node.js 18+ installed
    
*   PostgreSQL database
    
*   Git
    

### 1\. Clone the Repository

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/your-username/mazao-erp.git  cd mazao-erp   `

### 2\. Backend Setup

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd backend  # Install dependencies  npm install  # Set up environment variables  cp .env.example .env  # Edit .env with your database URL and JWT secret  # Set up database  npx prisma generate  npx prisma db push  npm run db:seed  # Start development server  npm run dev   `

### 3\. Frontend Setup

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd frontend  # Install dependencies  npm install  # Set up environment variables  cp .env.example .env  # Edit .env with your API URL  # Start development server  npm run dev   `

🗄️ Database Schema
-------------------

### Users Table

sql

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id (cuid) | email | password | role | createdAt | updatedAt   `

### Profiles Table

sql

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id (cuid) | userId | fullName | location | contactInfo | createdAt | updatedAt   `

### Crops Table

sql

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id (cuid) | farmerId | name | type | plantingDate | harvestDate | quantity | status | description | createdAt | updatedAt   `

### Enums

*   **UserRole**: ADMIN, FARMER
    
*   **CropType**: CEREAL, LEGUME, VEGETABLE, FRUIT, ROOT\_TUBER, OTHER
    
*   **CropStatus**: PLANTED, HARVESTED, SOLD
    

🔌 API Endpoints
----------------

### Authentication

*   POST /api/auth/register - Register a new farmer
    
*   POST /api/auth/login - User login
    
*   GET /api/auth/me - Get current user profile
    

### User Management

*   GET /api/users - Get all users (Admin only)
    
*   GET /api/users/:id - Get user by ID
    
*   PUT /api/users/:id - Update user
    
*   DELETE /api/users/:id - Delete user
    
*   GET /api/users/stats/count - Get user statistics
    

### Crop Management

*   GET /api/crops - Get all crops (filtered by user role)
    
*   POST /api/crops - Create new crop
    
*   GET /api/crops/:id - Get crop by ID
    
*   PUT /api/crops/:id - Update crop
    
*   DELETE /api/crops/:id - Delete crop
    
*   GET /api/crops/stats/summary - Get crop statistics
    

### Profile Management

*   GET /api/profile/me - Get user profile
    
*   PUT /api/profile/me - Update user profile
    

🎨 UI Components
----------------

The application uses a custom component library built with:

*   **Card components** for data display
    
*   **Modal dialogs** for forms and details
    
*   **Data tables** with pagination
    
*   **Chart components** for analytics
    
*   **Form elements** with validation
    

📱 Responsive Design
--------------------

The application is fully responsive and optimized for:

*   📱 Mobile devices (320px and up)
    
*   📟 Tablets (768px and up)
    
*   💻 Desktops (1024px and up)
    
*   🖥️ Large screens (1440px and up)
    

🔒 Security Features
--------------------

*   **JWT authentication** with secure HTTP-only cookies
    
*   **Password hashing** with bcryptjs
    
*   **Role-based access control**
    
*   **Input validation** on all endpoints
    
*   **CORS configuration** for cross-origin security
    
*   **SQL injection prevention** with Prisma ORM
    

🚀 Performance Optimizations
----------------------------

*   **React lazy loading** for components
    
*   **API response caching**
    
*   **Efficient database queries** with Prisma
    
*   **Optimized images** and assets
    
*   **Code splitting** for faster initial load
    

🤝 Contributing
---------------

1.  Fork the repository
    
2.  Create a feature branch (git checkout -b feature/amazing-feature)
    
3.  Commit your changes (git commit -m 'Add amazing feature')
    
4.  Push to the branch (git push origin feature/amazing-feature)
    
5.  Open a Pull Request
    

📄 License
----------

This project is licensed under the MIT License - see the [LICENSE](https://LICENSE) file for details.

🙏 Acknowledgments
------------------

*   Inspired by Kenyan agricultural practices
    
*   Built with modern web development best practices
    
*   Icons by [Lucide](https://lucide.dev)
    
*   Charts by [Recharts](https://recharts.org)
    

📞 Support
----------

For support, email [hassan@example.com](https://mailto:hassan@example.com) or join our Slack channel.

🏆 Project Status
-----------------

**Production Ready** - The application is fully functional and deployed for demonstration purposes.

**Built with ❤️ for the agricultural community in Kenya and beyond.**