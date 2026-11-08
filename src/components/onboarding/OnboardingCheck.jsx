import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Company } from "@/api/entities";
import CompanySetupForm from "./CompanySetupForm";

export default function OnboardingCheck({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Check if user has completed onboarding
      if (currentUser.onboarding_completed) {
        setNeedsOnboarding(false);
        setIsLoading(false);
        return;
      }

      // Check if company exists - with error handling for rate limits
      try {
        const companies = await Company.list();
        const userCompany = companies.find(c => c.created_by === currentUser.email);
        
        if (!userCompany && !currentUser.onboarding_completed) {
          setNeedsOnboarding(true);
        } else {
          setCompany(userCompany);
          // Mark as completed if company exists but flag wasn't set
          if (userCompany && !currentUser.onboarding_completed) {
            await User.updateMyUserData({ onboarding_completed: true });
          }
        }
      } catch (companyError) {
        console.log('Could not load company data, allowing onboarding to proceed');
        // If we can't load company data (rate limit, etc.), show onboarding
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If we can't even get user data, something is wrong - but don't block the app
      setNeedsOnboarding(false);
    }
    
    setIsLoading(false);
  };

  const handleOnboardingComplete = async (newCompany) => {
    setCompany(newCompany);
    setNeedsOnboarding(false);
    
    // Refresh the page to load with new company data
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to AccounTech Co-Pilot! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Let's get your business set up in just a few minutes
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 <strong>Quick tip:</strong> You can skip the setup and add details later if you want to explore the app first!
              </p>
            </div>
          </div>
        </div>
        <CompanySetupForm 
          isOpen={needsOnboarding} 
          onComplete={handleOnboardingComplete}
        />
      </>
    );
  }

  return children;
}