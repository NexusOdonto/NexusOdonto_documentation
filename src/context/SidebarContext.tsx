import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean; // Para Drawer en móviles (< 1024px)
  isCollapsed: boolean;   // Para colapsar/desplegar en Desktop (>= 1024px)
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapse: () => void;
  setCollapsed: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("nexus_sidebar_collapsed") === "true";
  });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("nexus_sidebar_collapsed", String(next));
      return next;
    });
  };

  const setCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    localStorage.setItem("nexus_sidebar_collapsed", String(val));
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        isCollapsed,
        toggleSidebar,
        closeSidebar,
        toggleCollapse,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}