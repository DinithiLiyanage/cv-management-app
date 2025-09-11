// "use client";

// import React from "react";
// import Header from "../../../components/Header";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { 
//   Person, 
//   Edit, 
//   Save, 
//   Cancel, 
//   PhotoCamera, 
//   AccountCircle, 
//   Security, 
//   Notifications,
//   Work,
//   Palette,
//   Help,
//   Settings,
//   Visibility,
//   VisibilityOff,
//   Email,
//   Phone,
//   LocationOn,
//   Tune,
//   PrivacyTip
// } from "@mui/icons-material";

// type SettingsSection = 'account' | 'security' | 'notifications' | 'preferences' | 'privacy' | 'help';
//   Email,
//   Phone,
//   LocationOn
// } from "@mui/icons-material";

// interface UserAccount {
//   name?: string;
//   email?: string;
//   secondaryEmails?: string[];
//   role?: string;
//   profilePicture?: string;
//   bio?: string;
//   location?: string;
//   phone?: string;
//   company?: string;
//   jobTitle?: string;
//   // Preferences
//   salaryExpectation?: string;
//   jobType?: string[];
//   remote?: boolean;
//   notifications?: boolean;
//   emailNotifications?: boolean;
//   pushNotifications?: boolean;
//   marketingEmails?: boolean;
//   // Privacy
//   profileVisibility?: 'public' | 'private' | 'connections';
//   showEmail?: boolean;
//   showPhone?: boolean;
//   showLocation?: boolean;
// }

// export default function SettingsPage() {
//   const params = useParams();
//   const [user, setUser] = useState<UserAccount | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUser, setEditedUser] = useState<UserAccount | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [activeSection, setActiveSection] = useState<SettingsSection>('account');
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
//   const jobTypeOptions = [
//     { id: "full-time", label: "Full-time" },
//     { id: "part-time", label: "Part-time" },
//     { id: "contract", label: "Contract" },
//     { id: "internship", label: "Internship" },
//     { id: "temporary", label: "Temporary" },
//     { id: "freelance", label: "Freelance" },
//   ];

//   const sidebarItems = [
//     { id: 'account', label: 'Account', icon: AccountCircle },
//     { id: 'security', label: 'Security', icon: Security },
//     { id: 'notifications', label: 'Notifications', icon: Notifications },
//     { id: 'preferences', label: 'Job Preferences', icon: Work },
//     { id: 'privacy', label: 'Privacy', icon: Settings },
//     { id: 'help', label: 'Help & Support', icon: Help },
//   ];

//   useEffect(() => {
//     const fetchUserAccount = async () => {
//       try {
//         const userId = params.id;
//         const response = await fetch(
//           `http://localhost:3001/api/user/profile/${userId}`
//         );
//         const data = await response.json();
//         setUser(data);
//         setEditedUser(data);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     if (params.id) {
//       fetchUserAccount();
//     }
//   }, [params.id]);

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const userId = params.id;
//       const response = await fetch(
//         `http://localhost:3001/api/user/profile/${userId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(editedUser),
//         }
//       );

//       if (response.ok) {
//         const updatedUser = await response.json();
//         setUser(updatedUser);
//         setIsEditing(false);
//       } else {
//         console.error("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedUser({ ...user });
//   };

//   const handlePasswordChange = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("New passwords don't match!");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const userId = params.id;
//       const response = await fetch(
//         `http://localhost:3001/api/user/change-password/${userId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             currentPassword: passwordData.currentPassword,
//             newPassword: passwordData.newPassword
//           }),
//         }
//       );

//       if (response.ok) {
//         alert("Password changed successfully!");
//         setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       } else {
//         alert("Failed to change password. Please check your current password.");
//       }
//     } catch (error) {
//       console.error("Error changing password:", error);
//       alert("Error changing password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateField = (field: keyof UserAccount, value: any) => {
//     setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
//   };

//   const toggleArrayItem = (field: keyof UserAccount, item: string) => {
//     if (!editedUser) return;
//     const currentArray = (editedUser[field] as string[]) || [];
//     const isSelected = currentArray.includes(item);

//     if (isSelected) {
//       updateField(field, currentArray.filter((i) => i !== item));
//     } else {
//       updateField(field, [...currentArray, item]);
//     }
//   };

//   const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
//     setShowPasswords(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
//   };

//   const renderAccountSection = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
//         {isEditing ? (
//           <div className="flex space-x-2">
//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//             >
//               <Save className="w-4 h-4 mr-2" />
//               {loading ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={handleCancel}
//               className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               <Cancel className="w-4 h-4 mr-2" />
//               Cancel
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="flex items-center px-4 py-2 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors"
//           >
//             <Edit className="w-4 h-4 mr-2" />
//             Edit
//           </button>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         {/* Profile Picture */}
//         <div className="flex items-center space-x-6 mb-6">
//           <div className="relative">
//             {(isEditing ? editedUser?.profilePicture : user?.profilePicture) ? (
//               <img
//                 src={isEditing ? editedUser?.profilePicture : user?.profilePicture}
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full object-cover border-2 border-[#0090D9]"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-[#0090D9]">
//                 <Person className="text-[#0090D9] text-3xl" />
//               </div>
//             )}
//             {isEditing && (
//               <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#0090D9] text-white rounded-full flex items-center justify-center hover:bg-[#007bb5] transition-colors">
//                 <PhotoCamera className="text-xs" />
//               </button>
//             )}
//           </div>
//           <div className="flex-1">
//             <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
//             <p className="text-sm text-gray-500">This will be displayed on your profile</p>
//           </div>
//         </div>

//         {/* Basic Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={editedUser?.name || ""}
//                 onChange={(e) => updateField('name', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Your full name"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.name || "Not specified"}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             {isEditing ? (
//               <input
//                 type="email"
//                 value={editedUser?.email || ""}
//                 onChange={(e) => updateField('email', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="your.email@example.com"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.email || "Not specified"}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={editedUser?.jobTitle || ""}
//                 onChange={(e) => updateField('jobTitle', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Your job title"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.jobTitle || "Not specified"}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={editedUser?.company || ""}
//                 onChange={(e) => updateField('company', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Your company"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.company || "Not specified"}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={editedUser?.location || ""}
//                 onChange={(e) => updateField('location', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="City, Country"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.location || "Not specified"}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//             {isEditing ? (
//               <input
//                 type="tel"
//                 value={editedUser?.phone || ""}
//                 onChange={(e) => updateField('phone', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="+1 (555) 123-4567"
//               />
//             ) : (
//               <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.phone || "Not specified"}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Bio */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
//           {isEditing ? (
//             <textarea
//               value={editedUser?.bio || ""}
//               onChange={(e) => updateField('bio', e.target.value)}
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent resize-none"
//               placeholder="Tell us about yourself..."
//             />
//           ) : (
//             <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
//               {user?.bio || "No bio provided"}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const renderSecuritySection = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//             <div className="relative">
//               <input
//                 type={showPasswords.current ? "text" : "password"}
//                 value={passwordData.currentPassword}
//                 onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
//                 className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Enter current password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility('current')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//               >
//                 {showPasswords.current ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//             <div className="relative">
//               <input
//                 type={showPasswords.new ? "text" : "password"}
//                 value={passwordData.newPassword}
//                 onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
//                 className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Enter new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility('new')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//               >
//                 {showPasswords.new ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//             <div className="relative">
//               <input
//                 type={showPasswords.confirm ? "text" : "password"}
//                 value={passwordData.confirmPassword}
//                 onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                 className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
//                 placeholder="Confirm new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility('confirm')}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//               >
//                 {showPasswords.confirm ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <button
//             onClick={handlePasswordChange}
//             disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
//             className="w-full flex items-center justify-center px-4 py-2 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Changing Password..." : "Change Password"}
//           </button>
//         </div>

//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//           <p className="text-sm text-yellow-800">
//             <strong>Password Requirements:</strong> Use at least 8 characters with a mix of letters, numbers, and symbols.
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderNotificationsSection = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-6">
//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Email className="text-[#0090D9] w-5 h-5" />
//               <div>
//                 <h4 className="font-medium text-gray-800">Email Notifications</h4>
//                 <p className="text-sm text-gray-600">Receive notifications via email</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={user?.emailNotifications || false}
//                 onChange={(e) => updateField('emailNotifications', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Notifications className="text-[#0090D9] w-5 h-5" />
//               <div>
//                 <h4 className="font-medium text-gray-800">Push Notifications</h4>
//                 <p className="text-sm text-gray-600">Receive push notifications in browser</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={user?.pushNotifications || false}
//                 onChange={(e) => updateField('pushNotifications', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Work className="text-[#0090D9] w-5 h-5" />
//               <div>
//                 <h4 className="font-medium text-gray-800">Job Alerts</h4>
//                 <p className="text-sm text-gray-600">Get notified about new job opportunities</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={user?.notifications || false}
//                 onChange={(e) => updateField('notifications', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <Palette className="text-[#0090D9] w-5 h-5" />
//               <div>
//                 <h4 className="font-medium text-gray-800">Marketing Emails</h4>
//                 <p className="text-sm text-gray-600">Receive promotional content and updates</p>
//               </div>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={user?.marketingEmails || false}
//                 onChange={(e) => updateField('marketingEmails', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPreferencesSection = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-900">Job Preferences</h2>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-6">
//           {/* Job Types */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Job Types</label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {jobTypeOptions.map((option) => (
//                 <button
//                   key={option.id}
//                   onClick={() => toggleArrayItem("jobType", option.id)}
//                   className={`p-3 text-sm text-center rounded-lg border-2 transition-colors ${
//                     (user?.jobType || []).includes(option.id)
//                       ? "border-[#0090D9] bg-blue-50 text-[#0090D9]"
//                       : "border-gray-200 hover:border-[#0090D9] text-gray-700"
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Salary Expectation */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Salary Expectation</label>
//             <select
//               value={user?.salaryExpectation || ""}
//               onChange={(e) => updateField("salaryExpectation", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent bg-white"
//             >
//               <option value="">Select range</option>
//               <option value="Under $30,000">Under $30,000</option>
//               <option value="$30,000 - $50,000">$30,000 - $50,000</option>
//               <option value="$50,000 - $70,000">$50,000 - $70,000</option>
//               <option value="$70,000 - $100,000">$70,000 - $100,000</option>
//               <option value="$100,000 - $150,000">$100,000 - $150,000</option>
//               <option value="$150,000+">$150,000+</option>
//               <option value="Prefer not to say">Prefer not to say</option>
//             </select>
//           </div>

//           {/* Remote Work */}
//           <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//             <div>
//               <h4 className="font-medium text-gray-800">Remote Work</h4>
//               <p className="text-sm text-gray-600">Open to remote opportunities</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={user?.remote || false}
//                 onChange={(e) => updateField('remote', e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPrivacySection = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-900">Privacy Settings</h2>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-6">
//           {/* Profile Visibility */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">Profile Visibility</label>
//             <div className="space-y-2">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="profileVisibility"
//                   value="public"
//                   checked={user?.profileVisibility === 'public'}
//                   onChange={(e) => updateField('profileVisibility', e.target.value)}
//                   className="mr-3 text-[#0090D9]"
//                 />
//                 <div>
//                   <span className="font-medium">Public</span>
//                   <p className="text-sm text-gray-600">Anyone can view your profile</p>
//                 </div>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="profileVisibility"
//                   value="connections"
//                   checked={user?.profileVisibility === 'connections'}
//                   onChange={(e) => updateField('profileVisibility', e.target.value)}
//                   className="mr-3 text-[#0090D9]"
//                 />
//                 <div>
//                   <span className="font-medium">Connections Only</span>
//                   <p className="text-sm text-gray-600">Only your connections can view your profile</p>
//                 </div>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="profileVisibility"
//                   value="private"
//                   checked={user?.profileVisibility === 'private'}
//                   onChange={(e) => updateField('profileVisibility', e.target.value)}
//                   className="mr-3 text-[#0090D9]"
//                 />
//                 <div>
//                   <span className="font-medium">Private</span>
//                   <p className="text-sm text-gray-600">Only you can view your profile</p>
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Contact Information Visibility */}
//           <div>
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <Email className="text-[#0090D9] w-5 h-5" />
//                   <div>
//                     <h4 className="font-medium text-gray-800">Show Email</h4>
//                     <p className="text-sm text-gray-600">Display email on public profile</p>
//                   </div>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={user?.showEmail || false}
//                     onChange={(e) => updateField('showEmail', e.target.checked)}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//                 </label>
//               </div>

//               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <Phone className="text-[#0090D9] w-5 h-5" />
//                   <div>
//                     <h4 className="font-medium text-gray-800">Show Phone</h4>
//                     <p className="text-sm text-gray-600">Display phone number on public profile</p>
//                   </div>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={user?.showPhone || false}
//                     onChange={(e) => updateField('showPhone', e.target.checked)}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//                 </label>
//               </div>

//               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <LocationOn className="text-[#0090D9] w-5 h-5" />
//                   <div>
//                     <h4 className="font-medium text-gray-800">Show Location</h4>
//                     <p className="text-sm text-gray-600">Display location on public profile</p>
//                   </div>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={user?.showLocation || false}
//                     onChange={(e) => updateField('showLocation', e.target.checked)}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderHelpSection = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-900">Help & Support</h2>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-6">
//           <div className="text-center">
//             <Help className="w-16 h-16 text-[#0090D9] mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">Need Help?</h3>
//             <p className="text-gray-600 mb-6">
//               We're here to help you get the most out of your experience
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors cursor-pointer">
//               <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
//               <p className="text-sm text-gray-600">Get help from our support team</p>
//               <p className="text-sm text-[#0090D9] mt-2">support@applyx.com</p>
//             </div>

//             <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors cursor-pointer">
//               <h4 className="font-medium text-gray-900 mb-2">FAQ</h4>
//               <p className="text-sm text-gray-600">Find answers to common questions</p>
//               <p className="text-sm text-[#0090D9] mt-2">View FAQ →</p>
//             </div>

//             <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors cursor-pointer">
//               <h4 className="font-medium text-gray-900 mb-2">User Guide</h4>
//               <p className="text-sm text-gray-600">Learn how to use all features</p>
//               <p className="text-sm text-[#0090D9] mt-2">View Guide →</p>
//             </div>

//             <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors cursor-pointer">
//               <h4 className="font-medium text-gray-900 mb-2">Report Issue</h4>
//               <p className="text-sm text-gray-600">Report bugs or technical issues</p>
//               <p className="text-sm text-[#0090D9] mt-2">Report →</p>
//             </div>
//           </div>

//           <div className="p-4 bg-gray-50 rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Version Information</h4>
//             <p className="text-sm text-gray-600">ApplyX v2.1.0</p>
//             <p className="text-sm text-gray-600">Last updated: September 2025</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'account':
//         return renderAccountSection();
//       case 'security':
//         return renderSecuritySection();
//       case 'notifications':
//         return renderNotificationsSection();
//       case 'preferences':
//         return renderPreferencesSection();
//       case 'privacy':
//         return renderPrivacySection();
//       case 'help':
//         return renderHelpSection();
//       default:
//         return renderAccountSection();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-8">
//           {/* Sidebar */}
//           <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
//             <nav className="space-y-1">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveSection(item.id as SettingsSection)}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     activeSection === item.id
//                       ? 'bg-[#0090D9] text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5 mr-3" />
//                   {item.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {renderContent()}
            
//             {/* Action Buttons */}
//             {activeSection !== 'help' && (
//               <div className="mt-8 flex space-x-4">
//                 <button
//                   onClick={handleSave}
//                   disabled={loading}
//                   className="flex items-center px-6 py-3 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Save className="w-4 h-4 mr-2" />
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Cancel className="w-4 h-4 mr-2" />
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//     <div className="h-full w-full px-10">
//       <div className="min-h-screen bg-gray-50">
//         <Header />

//         {/* Profile Content */}
//         <main className="max-w-4xl mx-auto py-8 px-4">
//             <div className="flex items-center justify-between mb-6">

//             {/* Salary Expectation */}
//             <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Salary Expectation
//             </label>
//             {isEditing ? (
//               <select
//                 value={editedUser?.salaryExpectation || ""}
//                 onChange={(e) =>
//                   updateField("salaryExpectation", e.target.value)
//                 }

//                 className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent bg-white"
//               >
//                 <option value="">Select range</option>
//                 <option value="Under $30,000">Under $30,000</option>
//                 <option value="$30,000 - $50,000">$30,000 - $50,000</option>
//                 <option value="$50,000 - $70,000">$50,000 - $70,000</option>
//                 <option value="$70,000 - $100,000">$70,000 - $100,000</option>
//                 <option value="$100,000 - $150,000">$100,000 - $150,000</option>
//                 <option value="$150,000+">$150,000+</option>
//                 <option value="Prefer not to say">Prefer not to say</option>
//               </select>
//             ) : (
//               <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
//                 {user?.salaryExpectation || "Not specified"}
//               </p>
//             )}
//           </div>
//           </div>

//           {/* Job Preferences */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Job Preferences
//           </h2>

//           {/* Job Types */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Preferred Job Types
//             </label>
//             {isEditing ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {jobTypeOptions.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => toggleArrayItem("jobType", option.id)}
//                     className={`p-3 text-sm text-center rounded-lg border-2 transition-colors ${
//                       (editedUser?.jobType || []).includes(option.id)
//                         ? "border-[#0090D9] bg-blue-50 text-[#0090D9]"
//                         : "border-gray-200 hover:border-[#0090D9] text-gray-700"
//                     }`}
//                   >
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {user?.jobType && user.jobType.length > 0 ? (
//                   user.jobType.map((type) => {
//                     const typeLabel =
//                       jobTypeOptions.find((opt) => opt.id === type)?.label ||
//                       type;
//                     return (
//                       <span
//                         key={type}
//                         className="px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
//                       >
//                         {typeLabel}
//                       </span>
//                     );
//                   })
//                 ) : (
//                   <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md w-full">
//                     No job type preferences specified
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Remote Work & Notifications */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//               <div>
//                 <h4 className="font-medium text-sm text-gray-800">
//                   Job Alerts
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   Receive email notifications
//                 </p>
//               </div>
//               {isEditing ? (
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={editedUser?.notifications || false}
//                     onChange={(e) =>
//                       updateField("notifications", e.target.checked)
//                     }
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
//                 </label>
//               ) : (
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm ${
//       </div>
//     </div>
//   );

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0090D9] mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading settings...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-8">
//           {/* Sidebar */}
//           <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
//             <nav className="space-y-1">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveSection(item.id as SettingsSection)}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                     activeSection === item.id
//                       ? 'bg-[#0090D9] text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5 mr-3" />
//                   {item.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             {renderContent()}
            
//             {/* Action Buttons */}
//             {activeSection !== 'help' && (
//               <div className="mt-8 flex space-x-4">
//                 <button
//                   onClick={handleSave}
//                   disabled={loading}
//                   className="flex items-center px-6 py-3 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Save className="w-4 h-4 mr-2" />
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Cancel className="w-4 h-4 mr-2" />
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
