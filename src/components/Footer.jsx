import React from 'react'

function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white shadow-md border-t border-gray-200 py-2">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            © {currentYear} GRG Admin. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer