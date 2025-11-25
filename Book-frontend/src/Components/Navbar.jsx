import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiMenu, HiX, HiSearch } from 'react-icons/hi'
// import CreativeSearchIcon from './CreativeSearchIcon'
import { useSearch } from '../context/SearchContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { searchQuery, setSearchQuery } = useSearch()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const handleClearSearch = () => {
        setSearchQuery('')
    }

    return (
        <nav className="bg-gray-300 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-2 sm:gap-4">
                    {/* Logo / Brand */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2  font-bold text-xl sm:text-2xl transition-colors flex-shrink-0"
                    >
                        <span className="text-2xl sm:text-3xl">📚</span>
                        <span className="hidden sm:inline text-gray-700">BookHub</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-4 bg-gray-200 rounded-xl">
                        <div className="relative w-full">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                                className="w-full px-4 py-2 pl-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-xl"
                                aria-label="Search books"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="transition-colors font-medium text-sm lg:text-base"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="transition-colors font-medium text-sm lg:text-base"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="transition-colors font-medium text-sm lg:text-base"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Icons Group - Search & Menu */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="bg-gray-300 p-2 rounded-full text-2xl focus:outline-none hover:bg-gray-400 transition-colors"
                            aria-label="Search"
                        >
                            <HiSearch className=" text-2xl" />
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="bg-gray-300 p-2 rounded-full text-2xl focus:outline-none hover:bg-gray-400 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <HiX /> : <HiMenu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isOpen && (
                    <div className="md:hidden pb-3">
                        <div className="relative w-full">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                                className="w-full px-4 py-2 pl-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                aria-label="Search books"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-300 p-1 rounded-full text-gray-600 hover:bg-gray-400 hover:text-gray-800 transition"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2 rounded-b-lg">
                        <Link
                            to="/"
                            className="block  hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="block  hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="block  hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </Link>
                    </div>
                )}
            </div>

            {/* Search Modal - Mobile */}
            {isSearchOpen && (
                <div className="fixed inset-2 bg-opacity-50 z-40 md:hidden flex items-start justify-center pt-0">
                    <div className="bg-white w-full max-w-md shadow-2xl p-3 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title or author..."
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                aria-label="Search books"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-300 p-1 rounded-full text-gray-600 hover:bg-gray-400 hover:text-gray-800 transition text-xl"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="bg-gray-300 p-2 rounded-full text-gray-600 hover:bg-gray-400 hover:text-gray-800 text-2xl focus:outline-none"
                                aria-label="Close search"
                            >
                                <HiX />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
