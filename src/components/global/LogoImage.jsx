import React from "react";
import brewQuery from "../../assets/images/brewQuery.png";
import { useNavigate } from "react-router-dom";

const LogoImage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={()=> navigate("/")} >
      <img
        src={brewQuery}
        alt="logo"
        className={`h-28 w-32 transition-all duration-300  dark:invert
  `}
      />
    </div>
  );
};

export default LogoImage;
