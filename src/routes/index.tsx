import type { RouteObject } from "react-router-dom";
import { HomePage } from "../features/home/HomePage";
import { ArticlePage } from "../features/documentation/ArticlePage";
import { TeamPage } from "../features/team/TeamPage";
import { BitacoraPage } from "../features/bitacora/BitacoraPage";

// Configuración de rutas de la plataforma de documentación
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/docs/*",
    element: <ArticlePage />,
  },
  {
    path: "/bitacora",
    element: <BitacoraPage />,
  },
  {
    path: "/team",
    element: <TeamPage />,
  },
  {
    path: "*",
    element: <ArticlePage />,
  },
];