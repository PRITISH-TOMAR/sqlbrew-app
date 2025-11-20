
import React from "react";
import Grid from "@mui/material/Grid";
import image  from "../../assets/images/signup.jpg"
export default function AuthImage() {
  return (
    <Grid
      item
      xs={false}
      sm={false}
      md={6}
      sx={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex-1"
    />
  );
}