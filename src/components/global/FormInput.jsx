import React from "react";
import { Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { themeClasses } from "../../utils/themeClasses";

export default function FormInput({ label, type = "text", name, value, onChange }) {
  const theme = useSelector((state) => state.theme);

  return (
    <div className="mt-4">
      <Input
        type={type}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        className={`!border ${themeClasses[theme].input}`}
        labelProps={{ className: themeClasses[theme].text }}
        containerProps={{ className: themeClasses[theme].text }}
      />
    </div>
  );
}
