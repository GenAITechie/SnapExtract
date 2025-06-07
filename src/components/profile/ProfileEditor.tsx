'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, Save } from 'lucide-react';

const profileSchema = z.object({
  email: z.string().email('Invalid email address. Please enter a valid email.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileEditor() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const user = localStorage.getItem('snapExtractUser');
    if (user) {
      setCurrentUser(user);
      const savedEmail = localStorage.getItem(`snapExtractProfile_${user}_email`);
      if (savedEmail) {
        form.setValue('email', savedEmail);
      }
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (currentUser) {
      localStorage.setItem(`snapExtractProfile_${currentUser}_email`, data.email);
      toast({
        title: 'Profile Updated',
        description: 'Your email address has been saved successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save profile. User not identified.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentUser && (
          <div className="p-4 bg-secondary rounded-md">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Logged in as</p>
                <p className="text-lg font-semibold text-primary">{currentUser}</p>
              </div>
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center text-base">
                 <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                Your Email Address
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} className="text-base py-3 px-4"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-base py-3" size="lg" disabled={form.formState.isSubmitting || !currentUser}>
          {form.formState.isSubmitting ? 'Saving...' : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Profile
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
