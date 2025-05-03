import React from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between py-3 px-4 bg-white/90 backdrop-blur-md border-b border-gray-200 ${className}`}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
          <Map className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          Smart<span className="text-blue-500">Traffic</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Home</a>
        <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Saved Routes</a>
        <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">History</a>
        <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">Settings</a>
      </nav>
      
      <div className="flex items-center gap-3">
        <button className="hidden md:block px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
          Get Started
        </button>
      </div>
    </motion.header>
  );
};

export default Header;