// REACT MODULES
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// IMPORTS
import { PasswordStrengthBar } from "../../utils/helpers/PasswordStrengthBar";
import { pingResetPassword, resetPassword } from "../../api/authApi";
import { themeClasses } from "../../utils/classes/themeClasses";

// UTILITIES
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Spinner } from "@material-tailwind/react";
import LogoImage from "../global/LogoImage";

// FUNCTION : Form Data Validation
const validateForm = (formData) => {
  const emptyFields = Object.entries(formData).filter(([value]) => {
    return value === null || value === undefined || value === "";
  });
  if (emptyFields.length > 0) {
    const fieldNames = emptyFields.map(([key]) => key).join(", ");
    toast.error(`Please fill in: ${fieldNames}`);
    return false;
  }
  if (formData.password != formData.confirmPassword) {
    toast.error(`Password and Confirm password do not match`);
    return false;
  }
  return true;
};

// FUNCTION : RESET PASSWORD
export default function ResetPassword() {
  // INITIALIZE : HOOKS
  const { resetKey } = useParams();
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();

  // INITIALIZE : STATES
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // USEFFECT : TO PING ON PAGE LOAD
  useEffect(() => {
    const pingLink = async () => {
      const res = await pingResetPassword(resetKey);
      if (res.success) {
        setValid(true);
      }
      else{
        setValid(false);
      }
      setLoading(false);
    };

    if (resetKey) pingLink();
  }, [resetKey]);

  // FUNCTION : CLEAR FORM DATA
  const handleClearForm = () => {
    setFormData((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, ""]))
    );
  };

  // FUNCTION: HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    const payload = { password: formData.password, key: resetKey };
    const res = await resetPassword(payload);
    if (res.success) {
      handleClearForm(formData);
      navigate("/login");
    } else {
      setMessage(res.message);
    }
  };

  // FUNCTION : HANDLE CHANGES IN FORM DATA
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // FUNCTION :  TOGGLE PASSWORD EYE
  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword((state) => !state);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
    >
     <LogoImage/>

      {loading && (
        <div className="flex flex-col items-center justify-center mt-10 text-lg">
          <p>Checking link...</p>
          <Spinner />
        </div>
      )}

      {/* INVALID / EXPIRED LINK */}
      {!loading && !valid && (
        <div className="flex flex-col items-center justify-center mt-10 text-lg text-red-500">
          This page seems to move permanently. The link has expired.
        </div>
      )}

      {!loading && valid && (
        <>
          <div className="flex justify-center mt-10 px-4 h-full">
            <form
              onSubmit={handleSubmit}
              className={`w-full max-w-md p-6 shadow-lg rounded-lg border ${themeClasses[theme].reverseText} ${themeClasses[theme].reverseBg} flex flex-col gap-4 items-center`}
            >
              <h2 className="text-2xl font-semibold text-center mb-2">
                Reset Your Password
              </h2>

              <div className="w-full flex flex-col">
                <div
                  className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden gap-2 ${themeClasses[theme].border} ${themeClasses[theme].reverseBg}`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].reverseText}`}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="mr-6"
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <FaEye size={16} />
                    ) : (
                      <FaEyeSlash size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden gap-2 ${themeClasses[theme].border} ${themeClasses[theme].reverseBg}`}
              >
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].reverseText}`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>

              <PasswordStrengthBar password={formData.password} />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                Reset Password
              </button>

              {message && (
                <p className="text-center text-blue-600 mb-3">{message}</p>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}
