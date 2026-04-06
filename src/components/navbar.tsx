"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Investoir</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <Link
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/#how-it-works"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/#about"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <hr className="my-2 border-gray-100" />
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
