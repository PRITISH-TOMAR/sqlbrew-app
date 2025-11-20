import { passwordStrength } from "check-password-strength";

// FUNCTION: STRENGTH COLOR FOR PASSWORD
const getStrengthColor = (strength) => {
  switch (strength.id) {
    case 0:
      return { color: "#ef4444", label: strength.value, width: "25%" };
    case 1:
      return { color: "#f97316", label: strength.value, width: "50%" };
    case 2:
      return { color: "#eab308", label: strength.value, width: "75%" };
    case 3:
      return { color: "#10b981", label: strength.value, width: "100%" };
    // Some versions of check-password-strength might have only 4 levels
    case 4:
      return { color: "#10b981", label: strength.value, width: "100%" };
    default:
      return { color: "#6b7280", label: strength.value, width: "0%" };
  }
};

// FUNCTION: Password Validation
const passWordValidationStrength = (password) => {
  const strength = passwordStrength(password);
  return getStrengthColor(strength);
};

export const PasswordStrengthBar = ({ password }) => {
  if (!password) return null; // Don't show bar when no password

  const strengthInfo = passWordValidationStrength(password);

  return (
    <div className="flex items-center gap-2 w-[90%] ml-6">
      <div
        className="text-sm  justify-self-center self-center font-medium "
        style={{ color: strengthInfo.color }}
      >
        {strengthInfo.label}
      </div>
      <div className="strength-bar-background w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="strength-bar-fill h-full transition-all duration-300 ease-in-out"
          style={{
            width: strengthInfo.width,
            backgroundColor: strengthInfo.color,
          }}
        />
      </div>
    </div>
  );
};
