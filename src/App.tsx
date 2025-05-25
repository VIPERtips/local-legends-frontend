
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BusinessListPage from "./pages/BusinessListPage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import AddBusinessPage from "./pages/AddBusinessPage";
import TopRatedPage from "./pages/TopRatedPage";
import AdminClaimsPage from "./pages/AdminClaimsPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
         <ScrollToTop/>
          <div className="min-h-screen bg-appBg">
            <Navbar />
            <Routes>
             
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/businesses" 
                element={
                  <ProtectedRoute>
                    <BusinessListPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/businesses/:id" 
                element={
                  <ProtectedRoute>
                    <BusinessDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-business" 
                element={
                  <ProtectedRoute>
                    <AddBusinessPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/top-rated" 
                element={
                  <ProtectedRoute>
                    <TopRatedPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/claims" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminClaimsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
