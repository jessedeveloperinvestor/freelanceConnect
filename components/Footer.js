import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              FreelanceHub
            </Link>
            <p className="mt-4 text-gray-400">
              Connect with talented professionals and find exciting projects.
              Your gateway to the freelance economy.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search?type=projects" className="text-gray-400 hover:text-white transition-colors">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link href="/search?type=services" className="text-gray-400 hover:text-white transition-colors">
                  Find Services
                </Link>
              </li>
              <li>
                <Link href="/search?type=professionals" className="text-gray-400 hover:text-white transition-colors">
                  Find Professionals
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Freelancing Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span className="text-gray-400">support@freelancehub.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2"></i>
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="mt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center md:text-left md:flex md:justify-between md:items-center">
          <p className="text-gray-400">
            &copy; {currentYear} FreelanceHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors mx-2">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
