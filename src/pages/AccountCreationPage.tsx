import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelectorFooter from '@/components/LanguageSelectorFooter';
import { Language } from '@/components/LanguageSelectorFooter';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const accountCreationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path to field to display error
});

type AccountCreationFormData = z.infer<typeof accountCreationSchema>;

const availableLanguages: Language[] = [
  { code: 'en', name: 'English (United States)' },
  { code: 'es', name: 'Español' },
];

const AccountCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  console.log('AccountCreationPage loaded');

  const form = useForm<AccountCreationFormData>({
    resolver: zodResolver(accountCreationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit: SubmitHandler<AccountCreationFormData> = async (data) => {
    setIsLoading(true);
    console.log('Account creation submitted:', { email: data.email, firstName: data.firstName });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: "Account Created Successfully!",
      description: "You can now sign in with your new account.",
    });
    navigate('/login'); // Redirect to login page after creation
  };

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    console.log('Language changed to:', languageCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <header className="mb-8">
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
          alt="Company Logo" 
          className="h-12 sm:h-16"
        />
      </header>
      <main className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Create your Account</CardTitle>
            <CardDescription>
              Enter your details to create a new account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" {...form.register('firstName')} />
                  {form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" {...form.register('lastName')} />
                  {form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} />
                {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...form.register('password')} />
                  {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input id="confirmPassword" type="password" {...form.register('confirmPassword')} />
                  {form.formState.errors.confirmPassword && <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="agreeToTerms" {...form.register('agreeToTerms')} />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                  I agree to the <a href="/terms" className="underline hover:text-blue-600">terms and conditions</a> and <a href="/privacy" className="underline hover:text-blue-600">privacy policy</a>.
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && <p className="text-sm text-red-500">{form.formState.errors.agreeToTerms.message}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0">
              <Button type="button" variant="link" className="px-0" onClick={() => navigate('/login')}>
                Already have an account? Sign in
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <LanguageSelectorFooter
        currentLanguage={currentLanguage}
        availableLanguages={availableLanguages}
        onLanguageChange={handleLanguageChange}
        helpLink="/help"
        privacyLink="/privacy"
        termsLink="/terms"
      />
    </div>
  );
};

export default AccountCreationPage;