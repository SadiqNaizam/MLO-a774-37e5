import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn Select component

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorFooterProps {
  currentLanguage: string;
  availableLanguages: Language[];
  onLanguageChange: (languageCode: string) => void;
  helpLink?: string; // Optional links
  privacyLink?: string;
  termsLink?: string;
}

const LanguageSelectorFooter: React.FC<LanguageSelectorFooterProps> = ({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  helpLink = "#",
  privacyLink = "#",
  termsLink = "#",
}) => {
  console.log("Rendering LanguageSelectorFooter, current lang:", currentLanguage);

  if (!availableLanguages || availableLanguages.length === 0) {
    console.warn("LanguageSelectorFooter: No available languages provided.");
    return null; // Or render a default state
  }

  return (
    <footer className="w-full py-4 px-4 md:px-8 mt-8 text-xs text-gray-600">
      <div className="max-w-md mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="w-full sm:w-auto">
            <Select value={currentLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full sm:w-[150px] text-xs h-8">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-xs">
                    {lang.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <nav className="flex space-x-3 sm:space-x-4">
          <a href={helpLink} className="hover:text-gray-800">Help</a>
          <a href={privacyLink} className="hover:text-gray-800">Privacy</a>
          <a href={termsLink} className="hover:text-gray-800">Terms</a>
        </nav>
      </div>
    </footer>
  );
};

export default LanguageSelectorFooter;