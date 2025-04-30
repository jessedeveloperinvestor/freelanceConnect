import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }) {
  const { isLoading } = useAuth();
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState('FreelanceHub');
  
  // Set page title based on current route
  useEffect(() => {
    const route = router.pathname;
    let title = 'FreelanceHub';
    
    if (route === '/') title = 'FreelanceHub - Home';
    else if (route === '/auth') title = 'FreelanceHub - Login or Register';
    else if (route === '/dashboard') title = 'FreelanceHub - Dashboard';
    else if (route === '/projects') title = 'FreelanceHub - Projects';
    else if (route === '/services') title = 'FreelanceHub - Services';
    else if (route === '/profile') title = 'FreelanceHub - My Profile';
    else if (route === '/search') title = 'FreelanceHub - Search';
    else if (route === '/messages') title = 'FreelanceHub - Messages';
    
    setPageTitle(title);
  }, [router.pathname]);
  
  // Show loading animation when auth state is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
