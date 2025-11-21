"use client";
import { useState } from "react";
import Link from "next/link";
import { NavLinks } from "@/Data/Navlinks";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="shadow-lg sticky top-0 z-50 border-b border-gray-700 backdrop-blur-md bg-gray-900/80">
      <div className="container mx-auto px-4 max-w-7xl flex items-center h-16">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-white hover:text-gray-300"
          >
            MainFrame Student Society, UoW
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center space-x-4">
            {NavLinks.map((link) => {
              return (
                <a
                  key={link.title}
                  href={link.href}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <span>{link.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <a
            href="/login"
            className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <span>Login</span>
          </a>
          <a
            href="/register"
            className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <span>Register</span>
          </a>
        </div>

        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NavLinks.map((link) => {
              return (
                <a
                  key={link.title}
                  href={link.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.title}</span>
                </a>
              );
            })}

            <div className="pt-4 space-y-2">
              <a
                href="/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 transition-colors w-full"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
              <a
                href="/register"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
