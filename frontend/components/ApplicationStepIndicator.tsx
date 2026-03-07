import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

export default function ApplicationStepIndicator({
    currentStep,
    steps,
}: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center
                                        transition-all duration-200
                                        ${
                                            isCompleted
                                                ? "bg-green-500 text-white"
                                                : isCurrent
                                                  ? "bg-[#0090D9] text-white ring-4 ring-blue-100"
                                                  : "bg-gray-200 text-gray-500"
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircleIcon />
                                    ) : (
                                        <span className="font-semibold">
                                            {stepNumber}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`
                                        mt-2 text-sm font-medium text-center
                                        ${isCurrent ? "text-[#0090D9]" : "text-gray-600"}
                                    `}
                                >
                                    {step}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        flex-1 h-1 mx-2 mb-6 transition-all duration-200
                                        ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                                    `}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
