"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NavLinks } from "@/Data/Navlinks";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { authApi } from "@/lib/api/auth-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ username?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authApi.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated && typeof window !== "undefined") {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          try {
            setUserData(JSON.parse(storedUserData));
          } catch (error) {
            console.error("Failed to parse user data:", error);
          }
        }
      } else {
        setUserData(null);
      }
    };

    checkAuth();

    // Check auth status on storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", checkAuth);

    // Listen for custom auth state change event
    window.addEventListener("authStateChanged", checkAuth);

    // Periodic check every 2 seconds to catch auth changes
    const interval = setInterval(checkAuth, 2000);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authStateChanged", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUserData(null);
    router.push("/");
  };

  return (
    <nav className="shadow-lg sticky top-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4 max-w-7xl flex items-center h-16">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:text-muted-foreground"
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
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span>{link.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage
                    src="https://avatar.iran.liara.run/public/boy"
                    alt={userData?.username || "User"}
                  />
                  <AvatarFallback>
                    {userData?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {userData?.username || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">My Account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <a
                href="/login"
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors"
              >
                <span>Login</span>
              </a>
              <a
                href="/register"
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 transition-colors"
              >
                <span>Register</span>
              </a>
            </>
          )}
        </div>

        <div className="md:hidden ml-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground"
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
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.title}</span>
                </a>
              );
            })}

            {isAuthenticated ? (
              <div className="pt-4 space-y-2 border-t border-border mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://avatar.iran.liara.run/public/boy"
                      alt={userData?.username || "User"}
                    />
                    <AvatarFallback>
                      {userData?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {userData?.username || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View Profile
                    </p>
                  </div>
                </div>
                <a
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile</span>
                </a>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-2">
                <a
                  href="/login"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </a>
                <a
                  href="/register"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary-foreground bg-primary hover:bg-primary/80 transition-colors w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
