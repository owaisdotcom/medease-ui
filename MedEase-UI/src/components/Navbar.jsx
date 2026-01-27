import { useState } from 'react'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
          <a 
            href="#home" 
            className="text-gray-900 font-body text-sm lg:text-base px-4 py-2 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Home
          </a>
          <a 
            href="#about" 
            className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
          >
            About Us
          </a>
          <a 
            href="#faqs" 
            className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
          >
            FAQs
          </a>
          <a 
            href="#contact" 
            className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
          >
            Contact Us
          </a>
        </div>
        
        {/* Center Logo */}
        <div className="flex items-center justify-center flex-shrink-0">
          <img 
            src="/logo.jpg" 
            alt="MedEase Logo" 
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
          />
        </div>
        
        {/* Right Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
          <button className="text-gray-700 font-body hover:text-gray-900 transition-colors text-sm lg:text-base">
            Log in
          </button>
          <button className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-5 lg:px-6 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm lg:text-base">
            Sign up
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-900 p-2 ml-4"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
          <a 
            href="#home" 
            className="block text-gray-900 font-body hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Home
          </a>
          <a 
            href="#about" 
            className="block text-gray-700 font-body hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            About Us
          </a>
          <a 
            href="#faqs" 
            className="block text-gray-700 font-body hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            FAQs
          </a>
          <a 
            href="#contact" 
            className="block text-gray-700 font-body hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Contact Us
          </a>
          <div className="flex flex-col space-y-2 pt-2">
            <button className="text-gray-700 font-body hover:text-gray-900 transition-colors text-left py-2 px-4">
              Log in
            </button>
            <button className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-4 py-2.5 rounded-lg hover:shadow-lg transition-all text-left">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

