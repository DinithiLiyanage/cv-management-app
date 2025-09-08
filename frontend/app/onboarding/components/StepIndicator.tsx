type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="mb-8 mt-4 py-4 w-full">
      <div className="flex items-center justify-center space-x-2 overflow-visible">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 relative z-10
                  ${
                    isActive
                      ? "bg-[#0090D9] border-[#0090D9] text-white"
                      : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {stepNumber < totalSteps && (
                <div
                  className={`
                    w-12 h-0.5 mx-2 transition-all duration-300
                    ${stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex justify-center mt-6 px-2">
        <div className="flex justify-between w-full max-w-md text-xs text-gray-600">
          <span
            className={`text-center ${
              currentStep === 1 ? "text-[#0090D9] font-medium" : ""
            }`}
          >
            Personal
          </span>
          <span
            className={`text-center ${
              currentStep === 2 ? "text-[#0090D9] font-medium" : ""
            }`}
          >
            Professional
          </span>
          <span
            className={`text-center ${
              currentStep === 3 ? "text-[#0090D9] font-medium" : ""
            }`}
          >
            Skills
          </span>
          <span
            className={`text-center ${
              currentStep === 4 ? "text-[#0090D9] font-medium" : ""
            }`}
          >
            Preferences
          </span>
        </div>
      </div>
    </div>
  );
}
