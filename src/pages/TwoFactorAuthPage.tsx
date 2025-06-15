import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"; // Assuming shadcn InputOTP
import LanguageSelectorFooter from '@/components/LanguageSelectorFooter';
import { Language } from '@/components/LanguageSelectorFooter';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const twoFactorSchema = z.object({
  code: z.string().min(6, { message: "Verification code must be 6 digits." }).max(6, { message: "Verification code must be 6 digits."}),
});
type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

const availableLanguages: Language[] = [
  { code: 'en', name: 'English (United States)' },
  { code: 'es', name: 'Español' },
];

const TwoFactorAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  console.log('TwoFactorAuthPage loaded for email:', email);

  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: '' },
  });

  const onSubmit: SubmitHandler<TwoFactorFormData> = async (data) => {
    setIsLoading(true);
    console.log('2FA code submitted:', data.code, 'for email:', email);
    // Simulate API call for 2FA verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dummy verification logic
    if (data.code === "123456") { // Example valid code
      setIsLoading(false);
      toast({
        title: "Verification Successful!",
        description: "You are now signed in.",
      });
      navigate('/dashboard'); // Navigate to dashboard or main app page
    } else {
      setIsLoading(false);
      form.setError("code", { type: "manual", message: "Invalid verification code. Please try again." });
      toast({
        title: "Verification Failed",
        description: "The code you entered is incorrect.",
        variant: "destructive",
      });
    }
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
            <CardTitle>Two-Step Verification</CardTitle>
            <CardDescription>
              {email && <p className="mb-2">A text message with a 6-digit verification code was sent to your phone (or check your authenticator app) for <span className="font-medium">{email}</span>.</p>}
              Enter the code to continue.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="space-y-1 w-full text-center">
                <Label htmlFor="code" className="sr-only">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={form.watch('code')}
                  onChange={(value) => form.setValue('code', value, { shouldValidate: true })}
                  {...form.register('code')} 
                >
                  <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    {/* <InputOTPSeparator /> */}
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {form.formState.errors.code && (
                  <p className="text-sm text-red-500 pt-2">{form.formState.errors.code.message}</p>
                )}
              </div>
              <Button type="button" variant="link" size="sm" className="text-blue-600 hover:text-blue-800">
                Resend code
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify
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

export default TwoFactorAuthPage;