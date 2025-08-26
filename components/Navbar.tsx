"use client"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black">VeriVoice</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/petitions"
              className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Petitions
            </Link>
            <Link
              href="/create-petition"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Create Petition
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none focus:text-black"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-300">
              <Link
                href="/"
                className="text-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Link>
              <Link
                href="/petitions"
                className="text-gray-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium"
              >
                View Petitions
              </Link>
              <Link
                href="/create-petition"
                className="bg-black text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              >
                Create Petition
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
