import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelectorFooter from '@/components/LanguageSelectorFooter';
import { Language } from '@/components/LanguageSelectorFooter';
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn toast
import { Loader2 } from 'lucide-react';

const recoverySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});
type RecoveryFormData = z.infer<typeof recoverySchema>;

const availableLanguages: Language[] = [
  { code: 'en', name: 'English (United States)' },
  { code: 'es', name: 'Español' },
];

const PasswordRecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  console.log('PasswordRecoveryPage loaded, initial email:', initialEmail);

  const form = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: initialEmail },
  });

  const onSubmit: SubmitHandler<RecoveryFormData> = async (data) => {
    setIsLoading(true);
    console.log('Password recovery requested for:', data.email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Recovery Email Sent",
      description: `If an account exists for ${data.email}, you will receive an email with instructions to reset your password.`,
    });
    // Optionally navigate to a confirmation page or back to login
    // navigate('/login');
  };

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    console.log('Language changed to:', languageCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
          alt="Company Logo" 
          className="h-12 sm:h-16"
        />
      </header>
      <main className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Password Recovery</CardTitle>
            <CardDescription>
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...form.register('email')}
                  aria-invalid={form.formState.errors.email ? "true" : "false"}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
              <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Recovery Link
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

export default PasswordRecoveryPage;