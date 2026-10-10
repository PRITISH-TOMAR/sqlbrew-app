import { passwordStrength } from "check-password-strength";
import { Box, Stack, Typography, useTheme } from "@mui/material";

// Four segments that fill as the password gets stronger, coloured from the theme
const levelOf = (id, palette) => {
  switch (id) {
    case 0:  return { color: palette.error.main,   filled: 1 };
    case 1:  return { color: palette.warning.main, filled: 2 };
    case 2:  return { color: palette.info.main,    filled: 3 };
    case 3:
    case 4:  return { color: palette.success.main, filled: 4 };
    default: return { color: palette.text.disabled, filled: 0 };
  }
};

export const PasswordStrengthBar = ({ password }) => {
  const theme = useTheme();
  if (!password) return null;

  const strength = passwordStrength(password);
  const { color, filled } = levelOf(strength.id, theme.palette);

  return (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 1 }} aria-live="polite">
      <Stack direction="row" gap={0.5} sx={{ flex: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              flex: 1, height: 4, borderRadius: 4,
              bgcolor: i < filled ? color : "divider",
              transition: "background-color .25s",
            }}
          />
        ))}
      </Stack>
      <Typography variant="caption" fontWeight={700} sx={{ color, minWidth: 72, textAlign: "right" }}>
        {strength.value}
      </Typography>
    </Stack>
  );
};
