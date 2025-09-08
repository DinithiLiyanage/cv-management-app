"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useRouter } from "next/navigation";
import Step1PersonalInfo from "./components/Step1PersonalInfo";
import Step2ProfessionalInfo from "./components/Step2ProfessionalInfo";
import Step3Skills from "./components/Step3Skills";
import Step4Preferences from "./components/Step4Preferences";
import StepIndicator from "./components/StepIndicator";
import NavigationButtons from "./components/NavigationButtons";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info (Step 1)
    profilePicture: undefined as string | undefined,
    bio: "",
    location: "",
    phone: "",
    // Professional Info (Step 2)
    jobTitle: "",
    company: "",
    experience: "",
    industry: "",
    // Skills (Step 3)
    skills: [] as string[],
    certifications: [] as string[],
    salaryExpectation: "",
    // Preferences (Step 4)
    jobType: [] as string[],
    remote: false,
    notifications: true,
  });

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFinish = async () => {
    try {
      // Send complete profile data to backend
      const response = await fetch(
        `http://localhost:3001/api/user/profile/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        router.push("/home"); // Redirect to main app
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSkip = () => {
    router.push("/home"); // Allow users to skip onboarding
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo data={formData} updateData={updateFormData} />
        );
      case 2:
        return (
          <Step2ProfessionalInfo data={formData} updateData={updateFormData} />
        );
      case 3:
        return <Step3Skills data={formData} updateData={updateFormData} />;
      case 4:
        return <Step4Preferences data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F7FF] to-[#B8E7FF] py-8 px-4 flex flex-col">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 mx-auto my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0090D9] mb-2">
            Welcome to ApplyX!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Let's set up your profile to get you started
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step Content */}
        <div className="mb-8 overflow-visible">{renderStep()}</div>

        {/* Navigation */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          onPrev={prevStep}
          onFinish={handleFinish}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}
