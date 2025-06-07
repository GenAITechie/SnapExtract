'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScanLine, User, LogOut, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';


export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('snapExtractUser');
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('snapExtractUser');
    localStorage.removeItem(`snapExtractProfile_${currentUser}_email`); // Clear profile email too
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Scan Bill', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <ScanLine className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">SnapExtract</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium",
                pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {currentUser && (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                 <Avatar className="h-9 w-9">
                   <AvatarImage src={`https://placehold.co/100x100.png?text=${currentUser.charAt(0).toUpperCase()}`} alt={currentUser} data-ai-hint="user initial" />
                   <AvatarFallback>{currentUser.charAt(0).toUpperCase()}</AvatarFallback>
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-56" align="end" forceMount>
               <DropdownMenuLabel className="font-normal">
                 <div className="flex flex-col space-y-1">
                   <p className="text-sm font-medium leading-none">{currentUser}</p>
                   {/* <p className="text-xs leading-none text-muted-foreground">
                     {userEmail || "No email set"}
                   </p> */}
                 </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                 <Settings className="mr-2 h-4 w-4" />
                 <span>Profile</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Log out</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
          )}
        </div>
         {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                 <DropdownMenuItem key={item.label} asChild className={cn(pathname === item.href && "bg-muted")}>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" /> {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {currentUser && (
                 <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <Settings className="mr-2 h-4 w-4" /> Profile
                 </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
