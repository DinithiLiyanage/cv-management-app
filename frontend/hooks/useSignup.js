import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import Alert from "../components/Alert";

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading state to false
  const [success, setSuccess] = useState(null); // State to handle success messages

  const registerUser = async (values) => {
    if (values.password !== values.confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // Log the request body
      console.log("Request URL: http://localhost:3001/api/auth/signup");
      console.log("Request body: ", JSON.stringify(values));

      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add headers for JSON content type
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status === 201) {
        setSuccess(data.message);
        login(data.token, data.user);
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred"); // Use error.message for better error handling
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, registerUser };
};

export default useSignup;
