import React, { useState, useEffect } from 'react';
import { ApplicationForm } from '../application/ApplicationForm';
import { CredentialsPage } from '../application/CredentialsPage';
import { UATDashboard } from './UATDashboard';
import { mockDb } from '../../services/mockDb';

interface UATOnboardingGuardProps {
  email: string;
  companyName: string;
}

type OnboardingStep = 'PRODUCT_SELECTION' | 'CREDENTIALS' | 'COMPLETE';

export const UATOnboardingGuard = ({ email, companyName }: UATOnboardingGuardProps) => {
  const [step, setStep] = useState<OnboardingStep | 'LOADING'>('LOADING');
  const [credentials, setCredentials] = useState<{
    clientId: string;
    clientSecret: string;
    sandboxUrl: string;
  } | null>(null);

  useEffect(() => {
    // Check for persistence flag or mockDb status
    const isOnboardingComplete = localStorage.getItem('uat_onboarding_complete') === 'true';
    const user = mockDb.getUser(email);

    if (isOnboardingComplete || (user && user.applicationId)) {
      setStep('COMPLETE');
    } else {
      setStep('PRODUCT_SELECTION');
    }
  }, [email]);

  const handleApplicationComplete = (data: any) => {
    // Update mockDb to persist product selection
    mockDb.createUser({
      email,
      companyName: data.companyName || 'Valued Partner',
      applicationId: `IND-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      uatProgress: [],
      agreementStatus: 'PENDING',
      commercialTerms: { rateLimit: '100 req/s', wholesaleMargin: '10%', sla: '99.9%' },
      agreementVersion: 1,
      negotiationHistory: [],
    });

    // Generate credentials for the next step
    setCredentials({
      clientId: `ind_${Math.random().toString(36).substring(2, 11)}`,
      clientSecret: `sk_test_${Math.random().toString(36).substring(2, 26)}`,
      sandboxUrl: 'https://sandbox.indiana.network/api/v1',
    });

    setStep('CREDENTIALS');
  };

  const handleCredentialsComplete = () => {
    localStorage.setItem('uat_onboarding_complete', 'true');
    setStep('COMPLETE');
  };

  if (step === 'LOADING') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (step === 'PRODUCT_SELECTION') {
    return <ApplicationForm onComplete={handleApplicationComplete} />;
  }

  if (step === 'CREDENTIALS') {
    return credentials ? (
      <CredentialsPage
        credentials={credentials}
        onContinue={handleCredentialsComplete}
      />
    ) : (
      <div className="text-center p-8">Loading credentials...</div>
    );
  }

  return <UATDashboard companyName={companyName} onComplete={() => {}} />;
};
