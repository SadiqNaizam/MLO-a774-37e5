import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSelectorFooter from '@/components/LanguageSelectorFooter';
import { Language } from '@/components/LanguageSelectorFooter';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const discoverySchema = z.object({
  recoveryIdentifier: z.string().min(1, { message: "Please enter your phone number or recovery email." }),
});
type DiscoveryFormData = z.infer<typeof discoverySchema>;

const availableLanguages: Language[] = [
  { code: 'en', name: 'English (United States)' },
  { code: 'es', name: 'Español' },
];

const EmailDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  console.log('EmailDiscoveryPage loaded');

  const form = useForm<DiscoveryFormData>({
    resolver: zodResolver(discoverySchema),
    defaultValues: { recoveryIdentifier: '' },
  });

  const onSubmit: SubmitHandler<DiscoveryFormData> = async (data) => {
    setIsLoading(true);
    console.log('Email discovery attempted with:', data.recoveryIdentifier);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Account Search Initiated",
      description: `If an account is found matching your information, we will send details to your recovery method.`,
    });
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
            <CardTitle>Find your email</CardTitle>
            <CardDescription>
              Enter your phone number or recovery email address.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="recoveryIdentifier">Phone number or recovery email</Label>
                <Input
                  id="recoveryIdentifier"
                  type="text"
                  placeholder="Phone or email"
                  {...form.register('recoveryIdentifier')}
                  aria-invalid={form.formState.errors.recoveryIdentifier ? "true" : "false"}
                />
                {form.formState.errors.recoveryIdentifier && (
                  <p className="text-sm text-red-500">{form.formState.errors.recoveryIdentifier.message}</p>
                )}
              </div>
              <p className="text-xs text-gray-600">
                This can be a phone number you've previously added to your account or a dedicated recovery email address.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
              <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Email
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

export default EmailDiscoveryPage;