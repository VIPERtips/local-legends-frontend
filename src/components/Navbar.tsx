
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Local Legends</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/businesses" className="text-appText hover:text-primary px-3 py-2 rounded-md">
                  Browse
                </Link>
                <Link to="/top-rated" className="text-appText hover:text-primary px-3 py-2 rounded-md">
                  Top Rated
                </Link>
                <Link to="/add-business" className="text-appText hover:text-primary px-3 py-2 rounded-md">
                  Add Business
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin/claims" className="text-appText hover:text-primary px-3 py-2 rounded-md">
                    Admin
                  </Link>
                )}
                <span className="text-appText">
                  Hello, {user?.name}
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
