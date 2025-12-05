import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          <p>&copy; 2025 Community Support System. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/privacy" className="hover:text-gray-700 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-700 transition-colors">
            Terms of Service
          </a>
          <a href="/help" className="hover:text-gray-700 transition-colors">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;