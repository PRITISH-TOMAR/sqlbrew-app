// React Modules
import { useState } from "react";
import { useSelector } from "react-redux";

// Imports modules
import { themeClasses } from "../../utils/classes/themeClasses";
import { CountryCodeDropdown } from "../../utils/classes/CountryCodeDropDown";
import { sendOtpToMail, signupUser } from "../../api/authApi";
import { PasswordStrengthBar } from "../../utils/helpers/PasswordStrengthBar";
import Otp from "./OTP";

// Utilites used
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// FUNCTION : Email Validation
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const check = regex.test(email);
  if (!check) toast.error(`INVALID EMAIL..`);
  return check;
};

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

export default function Signup({ onSwitchToLogin }) {
  // INITIALIZE: HOOKS
  const theme = useSelector((state) => state.theme);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  // INITIALIZE : STATES
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailKey, setEmailKey] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
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

  // FUNCTION : ADD KEY FROM VERIFIED EMAIL TO FORM DATA
  const addEmailKeyToFormData = () => {
    return { ...formData, emailKey };
  };

  // FUNCTION : CLEAR FORM DATA
  const handleClearForm = () => {
    setFormData((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, ""]))
    );
  };

  // FUNCTION : SEND OTP TO EMAIL
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;
    setOtpLoading(true);
    const res = await sendOtpToMail(formData.email);
    if (res.success) {
      setShowOtp(true);
    }
    setOtpLoading(false);
  };

  // FUNCTION: HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = addEmailKeyToFormData();
    if (!validateForm(formDataToSend)) return;
    const res = await signupUser(formDataToSend);
    console.log(res);
    if (res.success) {
      handleClearForm(formDataToSend);
      navigate("/");
    }
  };

  return (
    <>
      {showOtp && (
        <Otp
          setShowOtp={setShowOtp}
          email={formData.email}
          showOtp={showOtp}
          setVerified={setVerified}
          setEmailKey={setEmailKey}
        />
      )}
      <form
        className=" flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <h2 className={`text-4xl font-medium ${themeClasses[theme].text}`}>
          Sign up
        </h2>
        <p className={`text-sm mt-3 ${themeClasses[theme].textMuted}`}>
          Create your account to get started
        </p>

        <div className="flex gap-3 w-full mt-6">
          <div
            className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden pl-6 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
          >
            <input
              type="text"
              placeholder="First Name"
              className={`bg-transparent placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
          </div>
          <div
            className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden pl-6 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
          >
            <input
              type="text"
              placeholder="Last Name"
              className={`bg-transparent placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center w-full mt-6">
          <CountryCodeDropdown
            value={formData.countryCode}
            onChange={(value) => handleChange("countryCode", value)}
            className="w-32 "
          />
          <div
            className={`flex items-center flex-1 bg-transparent border-y border-r h-12 rounded-r-full overflow-hidden pl-4 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
          >
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Phone Number"
              className={`bg-transparent placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
              value={formData.contact}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  handleChange("contact", value);
                }
              }}
              maxLength="10"
              required
            />
          </div>
        </div>

        <div
          className={`flex items-center w-full mt-6 bg-transparent border h-12 rounded-full overflow-hidden gap-2 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
        >
          <input
            type="email"
            placeholder="Email id"
            className={`bg-transparent pl-6  placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <button
            className={`relative -translate-x-5 px-3 py-1 ${
              themeClasses[theme].reverseBg
            } ${themeClasses[theme].reverseText} font-medium rounded-full ${
              themeClasses[theme].hoverReverse
            } transition-colors duration-200 shadow-sm
            ${(verified || otpLoading) && "cursor-not-allowed"}
            `}
            onClick={handleSendOtp}
            disabled={verified || otpLoading}
          >
            {verified ? (
              <FaLock />
            ) : otpLoading ? (
              <TailSpin height={30} width={30} />
            ) : (
              "Verify"
            )}
          </button>
        </div>
        <div className="w-full flex flex-col">
          <div
            className={`flex items-center mt-6 w-full bg-transparent border h-12 rounded-full overflow-hidden  gap-2 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              minLength={8}
              required
            />
            <button className="mr-6" onClick={togglePassword}>
              {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
          </div>
          <PasswordStrengthBar password={formData.password} />
        </div>

        <div
          className={`flex items-center mt-6 w-full bg-transparent border h-12 rounded-full overflow-hidden  gap-2 ${themeClasses[theme].border} ${themeClasses[theme].inputBg}`}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`bg-transparent pl-6 placeholder-current outline-none text-sm w-full h-full ${themeClasses[theme].text}`}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`mt-8 w-full h-11 flex justify-center items-center rounded-full transition-all ${
            verified
              ? `${themeClasses[theme].reverseBg} ${themeClasses[theme].reverseText} hover:opacity-90 cursor-pointer`
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!verified}
        >
          {loading ? (
            <TailSpin
              color={themeClasses[theme].reverseText}
              height={30}
              width={30}
            />
          ) : (
            "Create Account"
          )}
        </button>

        <p className={`text-sm mt-4 ${themeClasses[theme].textMuted}`}>
          Already have an account?{" "}
          <button
            type="button"
            className={`text-blue-500  hover:underline ${themeClasses[theme].link}`}
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </form>
    </>
  );
}
