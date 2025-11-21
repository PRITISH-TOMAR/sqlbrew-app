// REACT MODULES
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// IMPORTS
import { loginUser } from "../../api/authApi";

// Utlilites
import { themeClasses } from "../../utils/classes/themeClasses";
import { TailSpin } from "react-loader-spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ onSwitchToSignup }) {
  // INITIALIZE: HOOKS
  const theme = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  // INITIALIZE: STATES
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // FUNCTION : HANDLE CHANGES IN FORM DATA
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // FUNCTION :  TOGGLE PASSWORD EYE
  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword((state) => !state);
  };

  // FUNCTION : CLEAR FORM DATA
  const handleClearForm = () => {
    setFormData((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, ""]))
    );
  };

  // FUNCTION: HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(formData);
    if (res.success) {
      handleClearForm();
      navigate("/");
    }
  };
  
  return (
    <form
      className={`flex flex-col items-center justify-center `}
      onSubmit={handleSubmit}
    >
      <h2 className={`text-4xl font-medium ${themeClasses[theme].text} `}>
        Sign in
      </h2>
      <p className={`text-sm mt-3 ${themeClasses[theme].textMuted}`}>
        Welcome back! Please sign in to continue
      </p>

      <div className="flex items-center gap-4 w-full my-5">
        <div className={`w-full h-px ${themeClasses[theme].border}`}></div>
        <p
          className={`w-full text-nowrap text-sm ${themeClasses[theme].textMuted}`}
        >
          sign in with email
        </p>
        <div className={`w-full h-px ${themeClasses[theme].border}`}></div>
      </div>

      <div
        className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden  gap-2 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
      >
        <input
          type="email"
          placeholder="Email id"
          className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      <div
        className={`flex items-center mt-6 w-full bg-transparent border h-12 rounded-full overflow-hidden gap-2 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />
        <button className="mr-6" onClick={togglePassword}>
          {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
        </button>
      </div>

      <div
        className={`w-full flex items-center justify-between mt-8 ${themeClasses[theme].textMuted}`}
      >
        <div className="flex items-center gap-2">
          <input
            className="h-5"
            type="checkbox"
            id="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
          />
          <label className="text-sm" htmlFor="checkbox">
            Remember me
          </label>
        </div>
        <a className="text-sm underline hover:opacity-80" href="#">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={`mt-8 w-full h-11 rounded-full  hover:opacity-90 transition-opacity ${themeClasses[theme].buttonPrimary} ${themeClasses[theme].reverseBg} ${themeClasses[theme].reverseText}`}
      >
        {loading ? (
          <TailSpin
            color={themeClasses[theme].reverseText}
            height={30}
            width={30}
          />
        ) : (
          "Login"
        )}
      </button>

      <p className={`text-sm mt-4 ${themeClasses[theme].textMuted}`}>
        Don't have an account?{" "}
        <button
          type="button"
          className={`text-blue-500 hover:underline ${themeClasses[theme].link}`}
          onClick={onSwitchToSignup}
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
