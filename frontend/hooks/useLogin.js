import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading state to false
  const [success, setSuccess] = useState(null); // State to handle success messages

  const loginUser = async (values) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add headers for JSON content type
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      console.log("Response data: ", data);
      if (res.status === 200) {
        setSuccess(data.message);
        login(data.token, data.user);
        // Navigate to home page using Next.js router
        router.push("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message); // Use error.message for better error handling
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, loginUser };
};

export default useLogin;
