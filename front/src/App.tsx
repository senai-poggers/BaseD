import type { ReactNode } from "react";
import Shell from "./Shell";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Match from "./pages/Match";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Teams from "./pages/Teams";

const pages: Record<string, () => ReactNode> = {
  "/home": Home,
  "/eventos": Events,
  "/times": Teams,
  "/perfil": Profile,
  "/match": Match,
  "/configuracoes": Settings,
};

export default function App() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return <Landing />;
  if (path === "/login") return <Login />;
  if (path === "/cadastro") return <Signup />;
  const Page = pages[path];
  return <Shell>{Page ? <Page /> : <><h1>404 — Página não encontrada</h1><a className="button" href="/home">Voltar ao início</a></>}</Shell>;
}
