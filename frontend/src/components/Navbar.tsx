import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Sprout, Menu, X, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Crop Recommendation", path: "/crop-recommendation" },
    { name: "Fertilizer Suggestion", path: "/fertilizer-suggestion" },
    { name: "Yield Prediction", path: "/yield-prediction" },
    { name: "Price Estimation", path: "/price-estimation" },
    { name: "Disease Detection", path: "/disease-detection" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Khet AI</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.slice(1).map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to={item.path}>{item.name}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Profile/Auth Buttons */}
          {/* <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div> */}
          
          {/* Profile Icon for authenticated users (placeholder) */}
          <Button variant="ghost" size="icon" className="hidden">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-2">
            {navigationItems.slice(1).map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                asChild
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={item.path}>{item.name}</Link>
              </Button>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t space-y-2">
              <Button 
                variant="ghost" 
                asChild 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}