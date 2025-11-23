// src/hooks/useSidebarWidth.js
import { useEffect, useState } from "react";

export default function useSidebarWidth(sidebarId = "app-sidebar") {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      const isMobile = window.innerWidth < 1024; // lg breakpoint

      // On mobile -> overlay -> width = 0
      if (isMobile) {
        setWidth(0);
        return;
      }

      // Desktop -> get actual sidebar width
      const el = document.getElementById(sidebarId);
      if (el) setWidth(el.offsetWidth);
    }

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [sidebarId]);

  return width;
}
