import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export function MobileNav() {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 h-16 border-b bg-card z-30 flex items-center justify-between px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <Link href="/">
        <a className="text-xl font-bold">Koperasi Karyawan</a>
      </Link>

      <Avatar className="h-9 w-9">
        <AvatarImage src={user?.avatar || ""} alt={user?.fullName} />
        <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
    </div>
  );
}
