import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  // Start open only on wide screens (matches the theme's lg breakpoint, 1266px).
  // On smaller screens the sidebar is an overlay, so opening it on load would cover the page.
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.matchMedia('(min-width: 1266px)').matches);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
