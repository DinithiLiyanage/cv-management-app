"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Auth_img from "../../assets/SignIn.jpg";
import signinValidations from "../../validations/signinValidations";
import Link from "next/link";
import useLogin from "../../hooks/useLogin";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Disable the button until complete

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, success, loginUser } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  // useEffect(() => {
  //     if (success) {
  //       router.push("/home");
  //     }
  //   }, [success, router]);

  // Validate user information
  function validate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent form submission
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
    loginUser({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="block max-w-4xl mx-auto" id="SignIn">
        <div className="flex min-h-[500px] shadow-2xl rounded-lg overflow-hidden border border-gray-200">
          {/* Image Column */}
          <div className="flex-1 flex items-center p-0">
            <Image
              src={Auth_img}
              alt="Sign In"
              className="w-full h-full object-cover"
              width={450}
              height={500}
            />
          </div>

          {/* Form Column */}
          <div className="flex-1 flex items-center p-0">
            <div className="bg-white p-5 h-full w-full text-gray-800 pt-6 border-l-4 border-gray-300 shadow-inner">
              {/* Headers */}
              <div className="mb-6">
                <h2 className="font-bold text-2xl mb-6 pl-0">Welcome back!</h2>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2 pl-0">Sign in</h4>
              </div>

              <form className="text-[15px]" onSubmit={validate}>
                {/* Email Field */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  {errors.email.length > 0 && (
                    <div className="text-red-600">
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

                {/* Password Field */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  {errors.password.length > 0 && (
                    <div className="text-red-600">
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

                <div className="mb-4">&nbsp;</div>

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
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4">&nbsp;</div>

              {/* Sign up link */}
              <p className="text-xs text-center text-gray-600">
                Not registered yet?{" "}
                <Link
                  href="/register"
                  className="text-teal-500 hover:text-teal-600 font-medium"
                >
                  Sign up now!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
