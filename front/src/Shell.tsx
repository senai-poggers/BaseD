import type { ReactNode } from "react";
import { CalendarDays, Home, LockKeyhole, LogOut, MapPin, Search, Shield, Target, User } from "lucide-react";

const links = [
  ["/home", "Início", Home], ["/times", "Meu Time", Shield], ["/eventos", "Eventos", CalendarDays],
  ["/perfil", "Meu Perfil", User], ["/match", "Match", Target], ["/configuracoes", "Configurações", LockKeyhole],
] as const;

export function Logo({ href = "/" }: { href?: string }) {
  return <a className="logo" href={href}><img src="/BASED.ico" alt="BASED" /></a>;
}

export default function Shell({ children }: { children: ReactNode }) {
  return <div className="app">
    <aside className="sidebar">
      <Logo />
      <nav>{links.map(([to, label, Icon]) =>
        <a key={to} className={location.pathname === to ? "active" : ""} href={to}><Icon size={18} />{label}</a>,
      )}</nav>
      <a className="logout" href="/login"><LogOut size={18} /> Sair</a>
    </aside>
    <div className="main">
      <header className="topbar">
        <label className="search"><Search size={18} /><input placeholder="Buscar times, eventos, campeonatos..." /></label>
        <span className="location"><MapPin size={16} /> Palhoça - SC</span>
      </header>
      <main>{children}</main>
      <nav className="mobile-nav">{links.map(([to, label, Icon]) =>
        <a key={to} aria-label={label} title={label} className={location.pathname === to ? "active" : ""} href={to}><Icon size={20} /></a>,
      )}</nav>
    </div>
  </div>;
}
