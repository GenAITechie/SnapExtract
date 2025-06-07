
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScanLine, LogIn, AlertTriangle } from 'lucide-react';

const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = 'password';
const AUTH_COOKIE_NAME = 'snapExtractAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Redirect if already logged in (e.g., user navigates to /login manually)
  useEffect(() => {
    const isAuthenticated = document.cookie.includes(`${AUTH_COOKIE_NAME}=true`);
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      // Set a simple cookie for demo purposes
      // In a real app, this would be a secure, HTTP-only session cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // Cookie expires in 7 days
      document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/'); // Redirect to the main app page
      router.refresh(); // Force a refresh of the new page to ensure middleware runs with new cookie
    } else {
      setError('Invalid username or password.');
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please check your credentials.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <ScanLine className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">SnapExtract</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="py-3 px-4 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-3 px-4 text-base"
              />
            </div>
            {error && (
              <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full text-base py-3" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground pt-6">
          <p>Use username: <span className="font-semibold text-primary">admin</span> & password: <span className="font-semibold text-primary">password</span></p>
        </CardFooter>
      </Card>
       <footer className="py-8 px-6 text-center text-sm text-muted-foreground">
        SnapExtract - Streamlining your bill management.
      </footer>
    </div>
  );
}
