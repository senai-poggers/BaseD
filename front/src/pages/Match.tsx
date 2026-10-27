import { CheckCircle2, MapPin, Shield } from "lucide-react";

const reasons = [
  "Mesmo esporte (Futebol)", "Posição compatível (Atacante)",
  "Localização próxima (Palhoça - SC)", "Nível compatível (Amador)",
  "Disponibilidade (Disponível)",
];

export default function Match() {
  return <section className="panel match">
    <h1>Seu match com o time</h1><p className="muted">Veja o quanto o seu perfil combina com as necessidades do time.</p>
    <div className="match-team"><div className="score">92%<small>Compatibilidade</small></div>
      <div><Shield size={42} /><h2>Palhoça FC</h2><p>Futebol · Amador</p><p><MapPin size={14} /> Palhoça - SC</p></div>
    </div>
    <h3>Por que deu match?</h3>
    {reasons.map((reason) => <p key={reason}><CheckCircle2 size={16} /> {reason}</p>)}
    <a href="/times" className="button">Ver detalhes do time</a>
  </section>;
}
