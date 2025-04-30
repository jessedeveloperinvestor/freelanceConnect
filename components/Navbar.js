import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  // Check for unread messages
  useEffect(() => {
    if (isAuthenticated) {
      const checkUnreadMessages = async () => {
        try {
          const response = await fetch('/api/messages');
          if (response.ok) {
            const conversations = await response.json();
            const unread = conversations.reduce((total, conv) => total + conv.unread, 0);
            setUnreadMessages(unread);
          }
        } catch (error) {
          console.error('Error checking messages:', error);
        }
      };
      
      checkUnreadMessages();
      // Check for new messages every minute
      const interval = setInterval(checkUnreadMessages, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };
  
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          FreelanceHub
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`${router.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={`${router.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Dashboard
              </Link>
              
              {user?.role === 'client' ? (
                <Link href="/projects" className={`${router.pathname === '/projects' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  My Projects
                </Link>
              ) : (
                <Link href="/services" className={`${router.pathname === '/services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  My Services
                </Link>
              )}
              
              <Link href="/search" className={`${router.pathname === '/search' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Search
              </Link>
              
              <Link href="/messages" className={`${router.pathname === '/messages' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} relative`}>
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
              
              <Link href="/profile" className={`${router.pathname === '/profile' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Profile
              </Link>
              
              <button 
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              Login / Register
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t mt-4 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/" className={`py-2 ${router.pathname === '/' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={`py-2 ${router.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                
                {user?.role === 'client' ? (
                  <Link href="/projects" className={`py-2 ${router.pathname === '/projects' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                    My Projects
                  </Link>
                ) : (
                  <Link href="/services" className={`py-2 ${router.pathname === '/services' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                    My Services
                  </Link>
                )}
                
                <Link href="/search" className={`py-2 ${router.pathname === '/search' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                  Search
                </Link>
                
                <Link href="/messages" className={`py-2 ${router.pathname === '/messages' ? 'text-blue-600' : 'text-gray-700'} relative`} onClick={() => setIsMenuOpen(false)}>
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                
                <Link href="/profile" className={`py-2 ${router.pathname === '/profile' ? 'text-blue-600' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="py-2 text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="py-2 text-blue-600" onClick={() => setIsMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
