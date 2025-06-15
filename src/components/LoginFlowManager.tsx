import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast hook exists
import { Loader2 } from 'lucide-react'; // For loading state

// Define validation schemas
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).min(1, { message: "Email is required." }),
});

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

type LoginStep = 'email' | 'password';

interface LoginFlowManagerProps {
  onLoginSuccess: (data: { email: string; /* add other success data as needed */ }) => void;
  onNavigateToForgotPassword: (email?: string) => void;
  onNavigateToCreateAccount: () => void;
  onRequire2FA: (email: string) => void; // Callback when 2FA is required
  initialEmail?: string;
}

const LoginFlowManager: React.FC<LoginFlowManagerProps> = ({
  onLoginSuccess,
  onNavigateToForgotPassword,
  onNavigateToCreateAccount,
  onRequire2FA,
  initialEmail = '',
}) => {
  const [step, setStep] = useState<LoginStep>('email');
  const [currentEmail, setCurrentEmail] = useState<string>(initialEmail);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log(`Rendering LoginFlowManager - Step: ${step}, Email: ${currentEmail}`);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const handleEmailSubmit: SubmitHandler<EmailFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    console.log("Email submitted:", data.email);
    // Simulate API call for email check
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Example: Check if email exists. If not, option to create account.
    // For this example, we'll assume email is valid and proceed to password.
    setCurrentEmail(data.email);
    setStep('password');
    setIsLoading(false);
    passwordForm.reset(); // Reset password field when showing it
  };

  const handlePasswordSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    console.log("Password submitted for email:", currentEmail);
    // Simulate API call for login
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Example logic:
    if (data.password === "password123") { // Dummy correct password
      // Check if 2FA is required for this user
      const requires2FA = currentEmail.includes('2fa'); // Dummy check
      if (requires2FA) {
        console.log("2FA required for", currentEmail);
        onRequire2FA(currentEmail);
      } else {
        console.log("Login successful for", currentEmail);
        toast({ title: "Login Successful", description: "Welcome back!" });
        onLoginSuccess({ email: currentEmail });
      }
    } else {
      console.error("Incorrect password for", currentEmail);
      setError("Incorrect password. Please try again.");
      toast({ title: "Login Failed", description: "Incorrect password.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError(null);
    emailForm.setValue('email', currentEmail); // Keep current email in field
  };

  return (
    <Card className="w-full max-w-md">
      {step === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>to continue to YourApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email or phone</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...emailForm.register('email')}
                aria-invalid={emailForm.formState.errors.email ? "true" : "false"}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
                <Button type="button" variant="link" className="px-0 h-auto py-1 text-sm" onClick={() => onNavigateToForgotPassword()}>
                    Forgot email?
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <Button type="button" variant="ghost" onClick={onNavigateToCreateAccount} className="order-2 sm:order-1">
              Create account
            </Button>
            <Button type="submit" disabled={isLoading} className="order-1 sm:order-2">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Next
            </Button>
          </CardFooter>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
          <CardHeader>
             <Button variant="ghost" size="sm" onClick={handleBackToEmail} className="mb-2 -ml-2 h-auto p-1 self-start text-sm text-blue-600 hover:text-blue-800">
                &larr; {currentEmail}
            </Button>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Enter your password to sign in.</CardDescription>
            {/* User journey mentioned ProfilePreview here, but it's not in JSON, so skipping */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...passwordForm.register('password')}
                aria-invalid={passwordForm.formState.errors.password ? "true" : "false"}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
             <div>
                <Button type="button" variant="link" className="px-0 h-auto py-1 text-sm" onClick={() => onNavigateToForgotPassword(currentEmail)}>
                    Forgot password?
                </Button>
            </div>
            {/* Add "Stay signed in" checkbox if needed */}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Next
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};

export default LoginFlowManager;