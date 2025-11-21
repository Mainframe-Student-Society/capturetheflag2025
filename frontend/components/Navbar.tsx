"use client";
import { useState } from "react";
import Link from "next/link";
import { NavLinks } from "@/Data/Navlinks";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" shadow-lg ">
      <div
        className="container mx-auto px-4 max-w-7xl
      flex justify-between items-center "
      >
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-300"
            >
              MainFrame Student Society, UoW
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {NavLinks.map((link) => {
            return (
              <a
                key={link.title}
                href={link.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {" "}
                <span>{link.title}</span>
              </a>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
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
          </div>
        </div>
      )}
    </nav>
  );
}
