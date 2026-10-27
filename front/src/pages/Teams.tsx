import { Calendar, Plus, Shield } from "lucide-react";
import { useCatalog } from "../hooks";
import { loadOpenings } from "../lib/catalog";

export default function Teams() {
  const { items, loading, error } = useCatalog(loadOpenings);
  return <>
    <div className="page-heading"><Shield size={42} /><div><h1>Palhoça FC</h1><p>Futebol · Amador | Palhoça - SC</p></div>
      <button className="button"><Plus size={18} /> Nova vaga</button>
    </div>
    <h2 className="section-title">Vagas abertas</h2>
    {loading && <p className="muted">Carregando vagas...</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && items.length === 0 && <p className="muted">Nenhuma vaga aberta no momento.</p>}
    <div className="stack">{items.map((opening) =>
      <article className="panel item row" key={opening.id}><Shield size={30} />
        <div className="grow"><h3>{opening.pos}</h3><p>{opening.tags.join(" · ")}</p>
          <p>{opening.qtd} vaga{opening.qtd > 1 ? "s" : ""} · {opening.candidatos} candidatos</p>
          <small><Calendar size={14} /> Publicado em {opening.data}</small>
        </div><button className="button">Ver candidatos</button>
      </article>,
    )}</div>
  </>;
}
