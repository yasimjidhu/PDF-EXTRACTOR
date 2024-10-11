import { toast } from "react-toastify";

  // Validation function
  export const validate = (username,email,password,confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
      toast.warning("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return false;
    }
    return true;
  };
