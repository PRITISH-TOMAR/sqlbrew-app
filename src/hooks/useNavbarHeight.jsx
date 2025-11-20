// src/hooks/useNavbarHeight.js
import { useEffect, useState } from "react";

export default function useNavbarHeight(navbarId = "app-navbar") {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function updateHeight() {
      const el = document.getElementById(navbarId);
      if (el) setHeight(el.offsetHeight);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [navbarId]);
 
  return height;
}
