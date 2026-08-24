import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useEffect } from "react";

function DocsLayoutContent() {
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useSidebar();
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

  return (
    <div className="docs-layout">
      <TopBar 
        onMenuClick={toggleSidebar} 
        showMenuButton={true}
      />
      <div className="docs-body">
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