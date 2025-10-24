import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="gradient-text">PrepWise</span>
            </Link>
            {/* Theme toggle placed immediately after logo */}
            <div className="ml-3">
              <ThemeToggle size="icon" className="hover-lift z-50" aria-label="Toggle theme" />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/help" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Help
            </Link>
          </div>
          
          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/features" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/help" 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {user ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleSignOut}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;