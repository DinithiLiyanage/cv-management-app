"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ApplicationStepIndicator from "@/components/ApplicationStepIndicator";
import {
    Button,
    TextField,
    CircularProgress,
    Alert,
    Chip,
    Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddIcon from "@mui/icons-material/Add";
import { API_URL } from "@/lib/config";
import { parseCVFile, ParsedCVData } from "@/lib/cvParser";

function ApplyPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get("jobId");
    const source = searchParams.get("source");
    const jobTitle = searchParams.get("title");
    const company = searchParams.get("company");

    // Application steps
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Upload CV", "Fill Details", "Review & Submit"];

    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingApplicationId, setExistingApplicationId] = useState<
        string | null
    >(null);
    const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(
        null,
    );

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        yearsOfExperience: "",
        currentCompany: "",
        linkedInUrl: "",
        websiteUrl: "",
        githubUrl: "",
        coverLetterText: "",
    });

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

    const [files, setFiles] = useState<{
        resume: File | null;
    }>({
        resume: null,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user_data");
            if (userData) {
                const parsedData = JSON.parse(userData);
                setToken(parsedData.userToken);
                setUserId(parsedData.userId);

                // Pre-fill user data if available
                if (parsedData.firstName && parsedData.lastName) {
                    setFormData((prev) => ({
                        ...prev,
                        fullName: `${parsedData.firstName} ${parsedData.lastName}`,
                        email: parsedData.email || "",
                    }));
                }
            } else {
                router.push("/login");
                return;
            }
        }
    }, [router]);

    // Check for existing application
    useEffect(() => {
        const checkExistingApplication = async () => {
            if (!token || !jobId) {
                setCheckingExisting(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/applications/job/${jobId}/user`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.ok) {
                    const application = await response.json();
                    // User has already applied - load their application
                    setIsEditMode(true);
                    setExistingApplicationId(application._id);
                    setExistingResumeUrl(application.resumeUrl);

                    // Pre-fill form with existing data
                    setFormData({
                        fullName: application.fullName || "",
                        email: application.email || "",
                        phone: application.phone || "",
                        yearsOfExperience:
                            application.yearsOfExperience?.toString() || "",
                        currentCompany: application.currentCompany || "",
                        linkedInUrl: application.linkedInUrl || "",
                        websiteUrl: application.websiteUrl || "",
                        githubUrl: application.githubUrl || "",
                        coverLetterText: application.coverLetterText || "",
                    });

                    if (application.skills && application.skills.length > 0) {
                        setSkills(application.skills);
                    }
                } else if (response.status !== 404) {
                    // Some other error occurred
                    console.error("Error checking existing application");
                }
            } catch (err) {
                console.error("Error checking existing application:", err);
            } finally {
                setCheckingExisting(false);
            }
        };

        if (token) {
            checkExistingApplication();
        }
    }, [token, jobId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles({ resume: file });
            setError(null);

            // Auto-parse if PDF
            if (file.type === "application/pdf") {
                setParsing(true);
                try {
                    const parsed = await parseCVFile(file);
                    setParsedData(parsed);

                    // Auto-fill form with parsed data
                    setFormData((prev) => ({
                        ...prev,
                        fullName: parsed.fullName || prev.fullName,
                        email: parsed.email || prev.email,
                        phone: parsed.phone || prev.phone,
                        currentCompany:
                            parsed.currentCompany || prev.currentCompany,
                        linkedInUrl: parsed.linkedInUrl || prev.linkedInUrl,
                        githubUrl: parsed.githubUrl || prev.githubUrl,
                        websiteUrl: parsed.websiteUrl || prev.websiteUrl,
                    }));

                    // Auto-fill skills if available
                    if (parsed.skills && parsed.skills.length > 0) {
                        setSkills(parsed.skills);
                    }
                } catch (err) {
                    console.error("Error parsing CV:", err);
                    setError(
                        "Could not auto-fill from CV. Please fill the form manually.",
                    );
                } finally {
                    setParsing(false);
                }
            }
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !files.resume && !isEditMode) {
            setError("Please upload your CV to continue");
            return;
        }
        setError(null);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handlePrevStep = () => {
        setError(null);
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const uploadFile = async (file: File): Promise<string> => {
        // For now, we'll simulate file upload by creating a data URL
        // In production, you should upload to cloud storage (AWS S3, Cloudinary, etc.)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // In production, replace this with actual cloud upload
                // const formData = new FormData();
                // formData.append('file', file);
                // const response = await fetch('/api/upload', { method: 'POST', body: formData });
                // const data = await response.json();
                // resolve(data.url);

                resolve(`uploaded_${file.name}`); // Simulated URL
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
        // For edit mode, resume is optional if already uploaded
        if (!isEditMode && !files.resume) {
            setError("Resume is required");
            return;
        }

        if (!token) {
            setError("Please login to apply");
            router.push("/login");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Upload files if new file is provided
            let resumeUrl = existingResumeUrl || "";
            if (files.resume) {
                resumeUrl = await uploadFile(files.resume);
            }

            const applicationData = {
                jobId,
                jobSource: source,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                resumeUrl,
                coverLetterText: formData.coverLetterText,
                yearsOfExperience: formData.yearsOfExperience
                    ? Number(formData.yearsOfExperience)
                    : undefined,
                currentCompany: formData.currentCompany,
                linkedInUrl: formData.linkedInUrl,
                websiteUrl: formData.websiteUrl,
                skills: skills.length > 0 ? skills : undefined,
            };

            // Determine if we're creating or updating
            const url = isEditMode
                ? `${API_URL}/api/applications/${existingApplicationId}`
                : `${API_URL}/api/applications`;
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(applicationData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        `Failed to ${isEditMode ? "update" : "submit"} application`,
                );
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/home");
            }, 2000);
        } catch (err: any) {
            setError(
                err.message ||
                    `Failed to ${isEditMode ? "update" : "submit"} application`,
            );
            setCurrentStep(3); // Stay on review page to show error
        } finally {
            setLoading(false);
        }
    };

    if (checkingExisting) {
        return (
            <div className="w-full min-h-screen">
                <Header />
                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <CircularProgress />
                    <p className="mt-4 text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="w-full min-h-screen">
                <Header />
                <div className="max-w-3xl mx-auto mt-20 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">
                            Application {isEditMode ? "Updated" : "Submitted"}{" "}
                            Successfully!
                        </h2>
                        <p className="text-gray-700">
                            Your application has been{" "}
                            {isEditMode ? "updated" : "received"}. You'll be
                            redirected to the home page shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Breadcrumb />

                <div className="bg-white rounded-xl shadow-md p-8 mt-6">
                    <h1 className="text-3xl font-bold text-[#0090D9] mb-2">
                        {isEditMode
                            ? "Edit Your Application"
                            : "Apply for Position"}
                    </h1>
                    {jobTitle && (
                        <p className="text-lg text-gray-600 mb-6">
                            {jobTitle} at {company}
                        </p>
                    )}

                    {isEditMode && (
                        <Alert severity="info" className="mb-6">
                            You have already applied for this position. You can
                            edit your application until the job closes.
                        </Alert>
                    )}

                    {/* Step Indicator */}
                    <ApplicationStepIndicator
                        currentStep={currentStep}
                        steps={steps}
                    />

                    {error && (
                        <Alert severity="error" className="mb-6">
                            {error}
                        </Alert>
                    )}

                    {parsedData && currentStep === 2 && (
                        <Alert
                            severity="success"
                            className="mb-6"
                            icon={<AutoFixHighIcon />}
                        >
                            CV parsed successfully! We've auto-filled your
                            information. Please review and update as needed.
                        </Alert>
                    )}

                    {/* Step 1: Upload CV */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center py-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {isEditMode
                                        ? "Update Your CV (Optional)"
                                        : "Upload Your CV"}
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    {isEditMode
                                        ? "Upload a new CV to replace your existing one, or keep your current CV"
                                        : "Upload your CV and we'll automatically extract your information"}
                                </p>

                                {isEditMode && existingResumeUrl && (
                                    <Alert
                                        severity="success"
                                        className="mb-4 max-w-md mx-auto"
                                    >
                                        You have already uploaded a CV. You can
                                        replace it by uploading a new one below.
                                    </Alert>
                                )}

                                <div className="max-w-md mx-auto">
                                    <div className="border-2 border-dashed border-[#0090D9] rounded-lg p-12 bg-blue-50">
                                        {files.resume ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center text-green-600">
                                                    <AttachFileIcon className="mr-2 text-4xl" />
                                                </div>
                                                <p className="font-medium text-gray-800">
                                                    {files.resume.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {(
                                                        files.resume.size / 1024
                                                    ).toFixed(2)}{" "}
                                                    KB
                                                </p>
                                                {parsing && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <CircularProgress
                                                            size={20}
                                                        />
                                                        <span className="text-sm text-[#0090D9]">
                                                            Parsing your CV...
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <CloudUploadIcon className="text-6xl text-[#0090D9] mx-auto" />
                                                <p className="text-gray-700">
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    PDF, DOC, or DOCX (Max 5MB)
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            component="label"
                                            variant="contained"
                                            className="mt-6 bg-[#0090D9] hover:bg-[#0090D9]"
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            {files.resume
                                                ? "Change File"
                                                : "Select File"}
                                            <input
                                                type="file"
                                                hidden
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    variant="outlined"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    className="bg-[#0090D9] hover:bg-[#0090D9]"
                                    onClick={handleNextStep}
                                    disabled={
                                        (!files.resume && !isEditMode) ||
                                        parsing
                                    }
                                >
                                    Next: Fill Details
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Fill Form */}
                    {currentStep === 2 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleNextStep();
                            }}
                            className="space-y-6"
                        >
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Personal Information
                                </h2>

                                <TextField
                                    fullWidth
                                    required
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <TextField
                                        required
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />

                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Professional Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <TextField
                                        label="Years of Experience"
                                        name="yearsOfExperience"
                                        type="number"
                                        value={formData.yearsOfExperience}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />

                                    <TextField
                                        label="Current Company"
                                        name="currentCompany"
                                        value={formData.currentCompany}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextField
                                        label="LinkedIn URL"
                                        name="linkedInUrl"
                                        value={formData.linkedInUrl}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />

                                    <TextField
                                        label="Portfolio/Website URL"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Skills
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <TextField
                                            fullWidth
                                            label="Add a skill"
                                            value={skillInput}
                                            onChange={(e) =>
                                                setSkillInput(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (
                                                        skillInput.trim() &&
                                                        !skills.includes(
                                                            skillInput.trim(),
                                                        )
                                                    ) {
                                                        setSkills([
                                                            ...skills,
                                                            skillInput.trim(),
                                                        ]);
                                                        setSkillInput("");
                                                    }
                                                }
                                            }}
                                            variant="outlined"
                                            placeholder="e.g., JavaScript, React, Python"
                                        />
                                        <Button
                                            variant="contained"
                                            className="bg-[#0090D9] hover:bg-[#0090D9]"
                                            onClick={() => {
                                                if (
                                                    skillInput.trim() &&
                                                    !skills.includes(
                                                        skillInput.trim(),
                                                    )
                                                ) {
                                                    setSkills([
                                                        ...skills,
                                                        skillInput.trim(),
                                                    ]);
                                                    setSkillInput("");
                                                }
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <Box className="flex flex-wrap gap-2 min-h-[60px] p-4 border rounded-lg bg-gray-50">
                                        {skills.length > 0 ? (
                                            skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={skill}
                                                    onDelete={() => {
                                                        setSkills(
                                                            skills.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            ),
                                                        );
                                                    }}
                                                    color="primary"
                                                    className="bg-[#0090D9]"
                                                />
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                No skills added yet. Add your
                                                skills above.
                                            </span>
                                        )}
                                    </Box>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Cover Letter
                                </h2>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Why are you interested in this position?"
                                    name="coverLetterText"
                                    value={formData.coverLetterText}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    placeholder="Tell us about your interest in this role and why you'd be a great fit..."
                                />
                            </div>

                            <div className="flex justify-between gap-4 pt-4">
                                <Button
                                    variant="outlined"
                                    onClick={handlePrevStep}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="bg-[#0090D9] hover:bg-[#0090D9]"
                                >
                                    Next: Review
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Review & Submit */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Review Your Application
                                </h2>
                                <p className="text-gray-600">
                                    Please review your information before
                                    submitting
                                </p>
                            </div>

                            {/* Review CV */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Resume/CV
                                </h3>
                                <div className="flex items-center text-gray-700">
                                    <AttachFileIcon className="mr-2" />
                                    <span>
                                        {files.resume?.name ||
                                            (isEditMode && existingResumeUrl
                                                ? "Previously uploaded CV (no changes)"
                                                : "No CV uploaded")}
                                    </span>
                                </div>
                            </div>

                            {/* Review Personal Info */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">
                                            Name:
                                        </span>
                                        <p className="font-medium">
                                            {formData.fullName ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Email:
                                        </span>
                                        <p className="font-medium">
                                            {formData.email || "Not provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Phone:
                                        </span>
                                        <p className="font-medium">
                                            {formData.phone || "Not provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Experience:
                                        </span>
                                        <p className="font-medium">
                                            {formData.yearsOfExperience
                                                ? `${formData.yearsOfExperience} years`
                                                : "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Review Professional Info */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-800 mb-3">
                                    Professional Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {formData.currentCompany && (
                                        <div>
                                            <span className="text-gray-600">
                                                Current Company:
                                            </span>
                                            <p className="font-medium">
                                                {formData.currentCompany}
                                            </p>
                                        </div>
                                    )}
                                    {formData.linkedInUrl && (
                                        <div>
                                            <span className="text-gray-600">
                                                LinkedIn:
                                            </span>
                                            <p className="font-medium break-all">
                                                {formData.linkedInUrl}
                                            </p>
                                        </div>
                                    )}
                                    {formData.websiteUrl && (
                                        <div>
                                            <span className="text-gray-600">
                                                Website:
                                            </span>
                                            <p className="font-medium break-all">
                                                {formData.websiteUrl}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Skills */}
                            {skills.length > 0 && (
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Skills
                                    </h3>
                                    <Box className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                color="primary"
                                                size="small"
                                                className="bg-[#0090D9]"
                                            />
                                        ))}
                                    </Box>
                                </div>
                            )}

                            {/* Review Cover Letter */}
                            {formData.coverLetterText && (
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Cover Letter
                                    </h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {formData.coverLetterText}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between gap-4 pt-4">
                                <Button
                                    variant="outlined"
                                    onClick={handlePrevStep}
                                    disabled={loading}
                                >
                                    Back to Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    className="bg-[#0090D9] hover:bg-[#0090D9]"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} />
                                        ) : null
                                    }
                                >
                                    {loading
                                        ? isEditMode
                                            ? "Updating..."
                                            : "Submitting..."
                                        : isEditMode
                                          ? "Update Application"
                                          : "Submit Application"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ApplyPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-screen flex items-center justify-center">
                    <CircularProgress />
                </div>
            }
        >
            <ApplyPageContent />
        </Suspense>
    );
}
