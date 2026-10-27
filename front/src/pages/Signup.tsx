import { useState } from "react";
import { ArrowLeft, ArrowRight, Trophy, User, Users } from "lucide-react";
import { Logo } from "../Shell";

const profiles = [
  ["Atleta", "Procure times, participe de eventos e encontre oportunidades.", User],
  ["Time / Base", "Cadastre seu time, publique vagas e encontre atletas.", Users],
  ["Organizador", "Crie campeonatos e eventos esportivos.", Trophy],
] as const;

export default function Signup() {
  const [profile, setProfile] = useState("Atleta");
  return <main className="signup">
    <a className="button secondary back-button" href="/login"><ArrowLeft size={18} />Voltar</a>
    <Logo href="/" /><p className="eyebrow">1 — Tipo de conta　　2 — Dados básicos　　3 — Finalizar</p>
    <h1>Qual é o seu perfil?</h1><p>Escolha o tipo de conta que melhor se encaixa em você.</p>
    <div className="grid three">{profiles.map(([name, description, Icon]) =>
      <button key={name} className={`panel option ${profile === name ? "selected" : ""}`} onClick={() => setProfile(name)}>
        <Icon size={32} /><strong>{name}</strong><span>{description}</span>
      </button>,
    )}</div>
    <a href="/home" className="button">Continuar <ArrowRight size={18} /></a>
  </main>;
}
