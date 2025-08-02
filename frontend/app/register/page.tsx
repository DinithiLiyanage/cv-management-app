"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Auth_img from "../../assets/SignIn.jpg";
import signinValidations from "../../validations/signinValidations";
import Link from "next/link";
import useSignup from "../../hooks/useSignup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function SignUp() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, success, registerUser } = useSignup();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  // Redirect to login page on successful registration
  useEffect(() => {
    if (success) {
      router.push("/login");
    }
  }, [success, router]);

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission

    // Perform validation first
    const validationErrors = signinValidations(email, password);

    if (
      validationErrors.emailErrors.length > 0 ||
      validationErrors.pwrdErrors.length > 0
    ) {
      setErrors({
        email: validationErrors.emailErrors || [],
        password: validationErrors.pwrdErrors || [],
      });
      return; // Stop execution if there are errors
    }

    // Proceed with user registration only if validation passes
    registerUser({ fName, lName, email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="block max-w-5xl mx-auto" id="SignUp">
        <div className="flex min-h-[600px] shadow-2xl rounded-lg overflow-hidden border border-gray-200">
          {/* Image Column */}
          <div className="flex-1 flex items-center p-0">
            <Image
              src={Auth_img}
              alt="Sign Up"
              className="w-full h-full object-cover"
              width={500}
              height={600}
            />
          </div>

          {/* Form Column */}
          <div className="flex-1 flex items-center p-0">
            <div className="bg-white p-6 h-full w-full text-gray-800 pt-6 relative border-l-4 border-gray-300 shadow-inner">
              {/* Headers */}
              <div className="mb-6">
                <h2 className="font-bold text-2xl mb-6 pl-0">Welcome!</h2>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2 pl-0">Sign up</h4>
              </div>

              <form className="text-[15px]" onSubmit={handleSubmission}>
                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name here"
                      value={fName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFName(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name here"
                      value={lName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLName(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  {errors.email.length > 0 && (
                    <div className="text-red-600 mb-2">
                      {errors.email.map((error, index) => (
                        <div key={index} className="text-xs">
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="email"
                    placeholder="Enter email here"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    {errors.password.length > 0 && (
                      <div className="text-red-600 mb-2">
                        {errors.password.map((error, index) => (
                          <div key={index} className="text-xs">
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password here"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 text-gray-400 text-lg flex items-center"
                      >
                        {showPassword ? (
                          <Visibility className="text-gray-400 text-lg" />
                        ) : (
                          <VisibilityOff className="text-gray-400 text-lg" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password here"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setConfirmPassword(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 text-gray-400 text-lg flex items-center"
                      >
                        {showConfirmPassword ? (
                          <Visibility className="text-gray-400 text-lg" />
                        ) : (
                          <VisibilityOff className="text-gray-400 text-lg" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">&nbsp;</div>

                {/* Success Alert */}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success} Redirecting to login page...
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4">&nbsp;</div>

              {/* Sign in link */}
              <p className="text-xs text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-teal-500 hover:text-teal-600 font-medium"
                >
                  Sign in here!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
