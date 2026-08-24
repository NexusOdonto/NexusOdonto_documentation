import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocsLayout } from "./layouts/DocsLayout";
import { ArticlePage } from "./pages/ArticlePage";
import { HomePage } from "./pages/HomePage";
import { BitacoraPage } from "./pages/BitacoraPage";
import { TeamPage } from "./pages/TeamPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DocsLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs/*" element={<ArticlePage />} />
          <Route path="/bitacora" element={<BitacoraPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="*" element={<ArticlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;