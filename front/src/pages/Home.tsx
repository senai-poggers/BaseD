import { MapPin, Shield, Trophy, User, Users } from "lucide-react";
import { useCatalog } from "../hooks";
import { loadTeams } from "../lib/catalog";

const shortcuts = [["/times", "Times perto de você", Users], ["/eventos", "Eventos e campeonatos", Trophy], ["/perfil", "Seu perfil", User]] as const;

export default function Home() {
  const { items: teams, loading, error } = useCatalog(loadTeams);
  return <>
    <h1>Olá, João! 👋</h1><p className="muted">Evolução é o único caminho.</p>
    <div className="grid three section">{shortcuts.map(([to, label, Icon]) =>
      <a href={to} className="panel shortcut" key={to}><Icon /><span>{label}<small>Ver todos</small></span></a>,
    )}</div>
    <h2 className="section-title">Times em destaque</h2>
    {loading && <p className="muted">Carregando times...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && teams.length === 0 && <p className="muted">Nenhum time cadastrado ainda.</p>}
    <div className="grid three">{teams.map((team) =>
      <article className="panel item" key={team.id}><Shield size={38} /><h3>{team.name}</h3><p>{team.info}</p>
        <p><MapPin size={14} /> {team.dist}</p><a className="button secondary" href="/match">Ver time</a>
      </article>,
    )}</div>
  </>;
}
