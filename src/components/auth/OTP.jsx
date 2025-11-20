// REACT MODULES
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

// IMPORTS
import otpimgLight from "../../assets/images/signup-light.jpg";
import otpimgDark from "../../assets/images/signup-dark.jpg";
import useNavbarHeight from "../../hooks/useNavbarHeight";
import { verifyEmail } from "../../api/authApi";

// UTILITIES
import { Button } from "@material-tailwind/react";
import { themeClasses } from "../../utils/classes/themeClasses";
import toast from "react-hot-toast";

const Otp = (props) => {
  // INITIALIZE : HOOKS
  const otpRef = useRef(null);
  const navbarHeight = useNavbarHeight();
  const theme = useSelector((state) => state.theme);

  // INITIALIZE : STATES
  const { setShowOtp, showOtp, setVerified, setEmailKey, email } = props;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [heightMargin, setHeightMargin] = useState();

  // USEFFECT : MARGIN TOP HEIGHT CALCULATION
  useEffect(() => {
    const marginFromTop = () => {
      let tempRefHeight = 0;
      if (otpRef.current) tempRefHeight = otpRef.current.offsetHeight;
      const effectiveHeight = window.innerHeight - navbarHeight;

      console.log(effectiveHeight - tempRefHeight);
      return navbarHeight + (effectiveHeight - tempRefHeight) / 2;
    };
    setHeightMargin(marginFromTop());
  }, [otpRef, navbarHeight]);

  // FUNCTION :  HANDLE CHANGES IN OTP BOX
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // FUNCTION :  HANDLE CLICKS OUTSIDE OF OTP BLOCK
  const handleClickOutside = (event) => {
    if (otpRef.current && !otpRef.current.contains(event.target)) {
      setOtp(new Array(6).fill(""));
      setShowOtp(false);
    }
  };

  // USEFFECT : EVENT LISTENERS
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FUNCTION: HANDLE VERIFY OTP
  const verifyHandler = async () => {
    const isOtpFilled = otp.every((digit) => digit !== "");
    if (!isOtpFilled) {
      toast.error("Fill OTP Completely");
      return;
    }
    const otpString = otp.join("");
    const res = await verifyEmail({ email, otp: otpString });

    if (res.success) {
      setVerified(true);
      setShowOtp(false);
      setEmailKey(res.data);
    }
  };

  return (
    showOtp && (
      <div
        style={{ marginTop: heightMargin }}
        ref={otpRef}
        className={`fixed inset-0  flex items-center justify-center w-[90%] max-w-2xl mx-auto z-30  my-auto rounded-[20px] h-fit py-2 cursor-pointer ${themeClasses[theme].reverseBg} opacity-90 ${themeClasses[theme].reverseText}`}
      >
        <div className="flex flex-col h-full justify-center items-center gap-4 mx-auto my-auto">
          <h1 className="font-semibold text-sm md:text-2xl text-center ">
            OTP sent to Email :{" "}
            <span className={`underline`}>{email.toUpperCase()}</span>
          </h1>
          <img
            src={theme === "dark" ? otpimgLight : otpimgDark}
            alt="OTP"
            className="h-[150px]"
          />
          <div className="flex gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                className="w-10 h-10 sm:w-12 sm:h-12 font-bold text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <Button
            className={`${themeClasses[theme].bg} ${themeClasses[theme].text}`}
            onClick={() => verifyHandler()}
          >
            Verify
          </Button>
        </div>
      </div>
    )
  );
};

export default Otp;
