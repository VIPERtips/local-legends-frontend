
# Local Legends Hub 🏪✨

**Discover and support amazing local businesses in your community**

A modern React application that connects customers with local businesses, featuring reviews, ratings, and business discovery tools.

## 🌟 Features

### For Customers
- **Browse Businesses**: Explore local businesses with pagination and filtering
- **Search & Filter**: Find businesses by name, category, and location
- **Reviews & Ratings**: Read and write detailed reviews with 1-5 star ratings
- **Top Rated**: Discover the highest-rated businesses by category
- **Business Details**: View comprehensive business information including contact details and location

### For Business Owners
- **Add Your Business**: Submit new business listings to the directory
- **Claim Ownership**: Verify and claim existing business listings
- **Business Management**: Update business information and respond to reviews

### For Administrators
- **Claims Management**: Review and approve/reject business ownership claims
- **User Management**: Oversee user accounts and permissions
- **Content Moderation**: Monitor reviews and business listings

## 🎨 Design System

- **Primary Color**: #4CAF50 (Green) - Trust and growth
- **Secondary Color**: #212121 (Dark Gray) - Professional and modern
- **Accent Color**: #FFC107 (Amber) - Energy and attention
- **Background**: #F5F5F5 (Light Gray) - Clean and minimal
- **Text**: #333333 (Charcoal) - Readable and accessible

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router DOM
- **State Management**: React Context API + TanStack Query
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **Backend Integration**: RESTful API with JWT authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd local-legends-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8081`

### Backend Setup
This frontend connects to a Spring Boot backend. Ensure your backend is running and accessible at the configured API endpoint.

**Required Backend Endpoints:**
- Authentication: `/api/auth/login`, `/api/auth/register`
- Businesses: `/api/businesses`, `/api/businesses/{id}`, `/api/businesses/search`
- Reviews: `/api/businesses/{id}/reviews`
- Claims: `/api/businesses/{id}/claim`, `/api/admin/claims`
- Top Rated: `/api/businesses/top-rated`

## 📱 Mobile Support

This application is fully responsive and optimized for mobile devices. For native mobile app development, we support Capacitor integration.

## 🔐 Authentication & Security

- JWT token-based authentication
- Role-based access control (User/Admin)
- Protected routes for authenticated users
- Secure API communication

## 📄 API Integration

The application integrates with a RESTful backend API:

```typescript
// Example API calls
GET /api/businesses?page=0&size=10
POST /api/businesses/{id}/reviews
POST /api/auth/login
```

## 🧪 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── contexts/           # React contexts for state management
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint




## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Roadmap

- [ ] Advanced search filters
- [ ] Business analytics dashboard
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Mobile app (React Native/Capacitor)
- [ ] Real-time notifications
- [ ] Business photo galleries
- [ ] Event listings

## 📞 Support

For support and questions:
- Create an issue in this repository
- Visit our [documentation](https://docs.locallegendshub.com)
- Contact us at support@locallegendshub.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for local communities
