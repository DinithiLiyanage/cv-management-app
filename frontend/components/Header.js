import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Business, Person, Settings } from "@mui/icons-material";

export default function Header() {
    const { userData, logout } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const handleViewProfile = () => {
        router.push(`/profile/${userData.id}`);
        setDropdownOpen(false);
    };

    const handleSettings = () => {
        router.push(`/settings/${userData.id}`);
        setDropdownOpen(false);
    };

    const handleOrganizations = () => {
        router.push(`/organizations/${userData.id}`);
        setDropdownOpen(false);
    };

    const handleLogoutClick = () => {
        handleLogout();
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Component for profile picture or icon
    const ProfileImage = ({ size = "w-8 h-8", showBorder = false }) => {
        if (userData?.profilePicture) {
            return (
                <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className={`${size} rounded-full object-cover ${
                        showBorder ? "border-1 border-[#0090D9]" : ""
                    }`}
                />
            );
        }
        return (
            <Person
                className={`text-[#0090D9] ${
                    size === "w-8 h-8" ? "text-2xl" : "text-lg"
                }`}
            />
        );
    };

    return (
        <div className="flex justify-between items-center bg-gradient-to-r from-[#B8E7FF] to-[#5CC9FF] px-15 py-6">
            <div className="flex items-center">
                <img
                    src="/logo-sign.png"
                    alt="ApplyX Logo"
                    width={80}
                    height={80}
                    className="mr-3"
                    style={{ objectFit: "contain" }}
                />
            </div>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-[#0090D9] font-medium rounded-full  transition-colors duration-200"
                >
                    <ProfileImage />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        {/* User info at top of dropdown */}
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <ProfileImage
                                    size="w-10 h-10"
                                    showBorder={true}
                                />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {userData?.name || "User"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {userData?.email || "user@example.com"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <button
                                onClick={handleViewProfile}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Person className="text-gray-500 text-lg" />
                                View Profile
                            </button>
                            <button
                                onClick={handleSettings}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Settings className="text-gray-500 text-lg" />
                                Settings
                            </button>
                            <button
                                onClick={handleOrganizations}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Business className="text-gray-500 text-lg" />
                                Organizations
                            </button>
                            <hr className="my-1 border-gray-200" />
                            <button
                                onClick={handleLogoutClick}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <svg
                                    className="w-4 h-4 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
