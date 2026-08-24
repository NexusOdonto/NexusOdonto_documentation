import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export function DocsLayout() {
  return (
    <div className="docs-layout">
      <TopBar />
      <div className="docs-body">
        <Sidebar />
        <main className="docs-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}