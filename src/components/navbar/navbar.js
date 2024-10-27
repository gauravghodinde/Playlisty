import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ logout, userImg, userName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed w-full top-0 z-30">
      <div className="backdrop-blur-md bg-black/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
             
                
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Playlisty
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600/30 hover:to-blue-500/30 border border-white/10 transition-all duration-200"
              >
                Logout
              </button>
              <button className="flex items-center px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600/30 hover:to-blue-500/30 border border-white/10 transition-all duration-200">
                {userImg && (
                  <img
                    src={userImg}
                    alt={userName}
                    className="h-8 w-8 rounded-lg border border-white/20"
                  />
                )}
                <span className="ml-2">{userName}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-white/10 mt-2">
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-center rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600/30 hover:to-blue-500/30 border border-white/10 transition-all duration-200"
              >
                Logout
              </button>
              <button className="flex items-center w-full px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600/30 hover:to-blue-500/30 border border-white/10 transition-all duration-200">
                {userImg && (
                  <img
                    src={userImg}
                    alt={userName}
                    className="h-8 w-8 rounded-lg border border-white/20"
                  />
                )}
                <span className="ml-2">{userName}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;