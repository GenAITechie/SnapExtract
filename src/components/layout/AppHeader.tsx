
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScanLine, Settings, FileText, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AUTH_COOKIE_NAME = 'snapExtractAuth';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Scan Bill', icon: FileText },
    { href: '/profile', label: 'Profile', icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    router.push('/login');
    router.refresh(); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <ScanLine className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">SnapExtract</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
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
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
        
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
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
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
