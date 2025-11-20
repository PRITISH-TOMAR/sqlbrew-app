import useNavbarHeight from "../../hooks/useNavbarHeight";
import singupDark from "../../assets/images/signup-dark.jpg";
import signupLight from "../../assets/images/signup-light.jpg";
import { themeClasses } from "../../utils/classes/themeClasses";
import { useSelector } from "react-redux";
import { useState } from "react";
import Login from "../../components/auth/Login";
import Signup from "../../components/auth/Signup";

export default function AuthContainer() {
  const theme = useSelector((state) => state.theme);
  const navHeight = useNavbarHeight();
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div 
      style={{ '--nav-height': `${navHeight}px` }}
      className={`flex h-[calc(100vh-var(--nav-height))] w-full  ${themeClasses[theme].bgAuth} ${themeClasses[theme].text}`}
    >
 
      <div className="w-full flex flex-col items-center justify-center p-4 md:w-[90%] w-full  ">
        {isLogin ? (
          <Login onSwitchToSignup={switchToSignup} />
        ) : (
          <Signup onSwitchToLogin={switchToLogin} />
        )}
      </div>

      {/* Image Section */}
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full w-full object-cover"
           src={theme == "light" ? signupLight : singupDark}
          alt="Authentication visual"
        />
      </div>
    </div>
  );
}