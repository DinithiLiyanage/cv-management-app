type NavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onSkip: () => void;
};

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onFinish,
  onSkip,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center">
      {/* Left side - Back button */}
      <div>
        {currentStep > 1 ? (
          <button
            onClick={onPrev}
            className="px-6 py-2 text-[#0090D9] border border-[#0090D9] rounded-lg hover:bg-[#0090D9] hover:text-white transition-colors duration-200 text-sm"
          >
            Back
          </button>
        ) : (
          <button
            onClick={onSkip}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
          >
            Skip for now
          </button>
        )}
      </div>

      {/* Right side - Next/Finish button */}
      <div>
        {currentStep < totalSteps ? (
          <button
            onClick={onNext}
            className="px-8 py-2 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            Complete Setup
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
