
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Save } from 'lucide-react';

const profileSchema = z.object({
  email: z.string().email('Invalid email address. Please enter a valid email.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const PROFILE_EMAIL_KEY = 'snapExtractProfile_email';

export function ProfileEditor() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem(PROFILE_EMAIL_KEY);
    if (savedEmail) {
      form.setValue('email', savedEmail);
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    localStorage.setItem(PROFILE_EMAIL_KEY, data.email);
    toast({
      title: 'Profile Updated',
      description: 'Your email address has been saved successfully.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit" className="w-full text-base py-3" size="lg" disabled={form.formState.isSubmitting}>
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
