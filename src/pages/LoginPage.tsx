import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginFlowManager from '@/components/LoginFlowManager';
import LanguageSelectorFooter from '@/components/LanguageSelectorFooter';
import { Language } from '@/components/LanguageSelectorFooter'; // Assuming Language type is exported

const availableLanguages: Language[] = [
  { code: 'en', name: 'English (United States)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = React.useState<string>('en');

  console.log('LoginPage loaded');

  const handleLoginSuccess = (data: { email: string }) => {
    console.log('Login successful:', data.email);
    // Navigate to a protected route, e.g., dashboard or homepage
    navigate('/dashboard'); // Replace with your desired route
  };

  const handleNavigateToForgotPassword = (email?: string) => {
    console.log('Navigating to forgot password for email:', email);
    navigate(email ? `/password-recovery?email=${encodeURIComponent(email)}` : '/password-recovery');
  };

  const handleNavigateToCreateAccount = () => {
    console.log('Navigating to create account');
    navigate('/account-creation');
  };

  const handleRequire2FA = (email: string) => {
    console.log('2FA required, navigating to 2FA page for email:', email);
    navigate(`/two-factor-auth?email=${encodeURIComponent(email)}`);
  };

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    console.log('Language changed to:', languageCode);
    // Here you would typically update i18n settings
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
          alt="Company Logo" 
          className="h-12 sm:h-16" // Responsive height
        />
      </header>
      <main className="w-full max-w-md">
        <LoginFlowManager
          onLoginSuccess={handleLoginSuccess}
          onNavigateToForgotPassword={handleNavigateToForgotPassword}
          onNavigateToCreateAccount={handleNavigateToCreateAccount}
          onRequire2FA={handleRequire2FA}
          // initialEmail can be passed from query params if needed
        />
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

export default LoginPage;