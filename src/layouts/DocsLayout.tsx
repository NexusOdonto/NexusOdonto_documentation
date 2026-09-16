import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";
import { WelcomeSplash } from "../components/ui/WelcomeSplash";
import { ScrollProgress } from "../components/ui/ScrollProgress";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useEffect } from "react";

function DocsLayoutContent() {
  const { isSidebarOpen, isCollapsed, closeSidebar, toggleSidebar, toggleCollapse } = useSidebar();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      toggleCollapse();
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className={`docs-layout ${isCollapsed ? 'layout-sidebar-collapsed' : ''}`}>
      <ScrollProgress />
      <WelcomeSplash />
      <TopBar
        onMenuClick={handleMenuClick}
        showMenuButton={true}
      />
      <div className={`docs-body ${isCollapsed ? 'body-sidebar-collapsed' : ''}`}>
        <Sidebar />
        <main className={`docs-content ${isHomePage ? 'home-content' : ''}`}>
          <Outlet />
        </main>
      </div>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
    </div>
  );
}

export function DocsLayout() {
  return (
    <SidebarProvider>
      <DocsLayoutContent />
    </SidebarProvider>
  );
}