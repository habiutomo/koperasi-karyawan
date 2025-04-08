import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div>
        
        <div className="p-6">
          {(title || description) && (
            <header className="mb-6">
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </header>
          )}
          
          {children}
        </div>
      </main>
    </div>
  );
}
