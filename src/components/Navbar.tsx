import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0  z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Local Legends</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
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
              <span className="text-appText">Hello, {user?.name}</span>
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
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-appText hover:text-primary focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-16 right-0 w-3/4 bg-gray-300/40 backdrop-blur-md rounded-l-lg shadow-lg p-6 flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/businesses"
                className="text-appText hover:text-primary text-lg"
                onClick={handleLinkClick}
              >
                Browse
              </Link>
              <Link
                to="/top-rated"
                className="text-appText hover:text-primary text-lg"
                onClick={handleLinkClick}
              >
                Top Rated
              </Link>
              <Link
                to="/add-business"
                className="text-appText hover:text-primary text-lg"
                onClick={handleLinkClick}
              >
                Add Business
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/claims"
                  className="text-appText hover:text-primary text-lg"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              )}
              <span className="text-gray-900 text-lg">Hello, {user?.name}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleLinkClick}>
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={handleLinkClick}>
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
