import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  CreditCard, 
  DollarSign, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useMediaQuery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Members",
      href: "/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Savings",
      href: "/savings",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      title: "Loans",
      href: "/loans",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Dividends",
      href: "/dividends",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    closeMobileMenu();
  };

  // Mobile menu button
  const mobileMenuButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden fixed top-4 left-4 z-50"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );

  // User info section
  const userInfo = (
    <div className="border-t pt-4 mt-auto">
      <div className="flex items-center px-4 py-2">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar || ""} alt={user?.fullName} />
          <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const sidebarContent = (
    <>
      <div className="px-4 py-6">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold">Koperasi Karyawan</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={closeMobileMenu}
            >
              <a 
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  location === item.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      {userInfo}
    </>
  );

  if (isMobile) {
    return (
      <>
        {mobileMenuButton}
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-background transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full pt-16 pb-4">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={cn("w-64 border-r bg-card flex flex-col h-screen", className)}>
      {sidebarContent}
    </div>
  );
}
