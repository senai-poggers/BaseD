import { useState } from "react";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { useCatalog } from "../hooks";
import { loadEvents } from "../lib/catalog";

const filters = [["todos", "Todos"], ["campeonato", "Campeonatos"], ["evento", "Eventos"]] as const;

export default function Events() {
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const { items, loading, error } = useCatalog(loadEvents);
  const events = items.filter((event) =>
    (filter === "todos" || event.tipo === filter) &&
    `${event.nome} ${event.info} ${event.local}`.toLowerCase().includes(query.toLowerCase()),
  );
  return <>
    <h1>Eventos e Campeonatos</h1>
    <div className="filters">{filters.map(([id, label]) =>
      <button key={id} className={filter === id ? "selected" : ""} onClick={() => setFilter(id)}>{label}</button>,
    )}</div>
    <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, esporte ou cidade..." />
    {loading && <p className="muted">Carregando eventos...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && events.length === 0 && <p className="muted">Nenhum evento encontrado.</p>}
    <div className="grid two section">{events.map((event) =>
      <article className="panel item" key={event.id}><Trophy size={32} /><h3>{event.nome}</h3><p>{event.info}</p>
        <p><CalendarDays size={14} /> {event.datas}</p><p><MapPin size={14} /> {event.local}</p>
        <p><Users size={14} /> {event.vagas} vagas</p><button className="button">Inscrever-se</button>
      </article>,
    )}</div>
  </>;
}
