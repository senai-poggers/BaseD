import { useEffect, useState } from "react";
import { Bell, Eye, LockKeyhole, MapPin, RotateCcw } from "lucide-react";

type Preferences = {
  eventNotifications: boolean;
  matchNotifications: boolean;
  activityNotifications: boolean;
  publicProfile: boolean;
  showLocation: boolean;
};
const defaults: Preferences = {
  eventNotifications: true, matchNotifications: true, activityNotifications: true,
  publicProfile: true, showLocation: true,
};
const notificationRows: [keyof Preferences, string, string][] = [
  ["eventNotifications", "Eventos e campeonatos", "Novos eventos e atualizações de inscrições."],
  ["matchNotifications", "Sugestões de match", "Times compatíveis com seu perfil."],
  ["activityNotifications", "Atividade no perfil", "Novos seguidores, curtidas e comentários."],
];
const privacyRows: [keyof Preferences, string, string][] = [
  ["publicProfile", "Perfil público", "Permite que times e atletas encontrem seu perfil."],
  ["showLocation", "Mostrar localização", "Exibe sua cidade para facilitar matches próximos."],
];

function readPreferences(): Preferences {
  const stored = localStorage.getItem("based-preferences");
  if (!stored) return defaults;

  const value: unknown = JSON.parse(stored);
  if (typeof value !== "object" || value === null) throw new Error("Preferências inválidas.");

  const savedValues = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.keys(defaults).map((key) => {
      const preference = key as keyof Preferences;
      const saved = preference in savedValues ? savedValues[preference] : defaults[preference];
      if (typeof saved !== "boolean") throw new Error(`Preferência inválida: ${key}.`);
      return [key, saved];
    }),
  ) as Preferences;
}

export default function Settings() {
  const [preferences, setPreferences] = useState(defaults);
  const [message, setMessage] = useState("As preferências ficam salvas neste dispositivo.");
  useEffect(() => {
    try {
      setPreferences(readPreferences());
    } catch (error) {
      console.error("Não foi possível carregar configurações.", error);
      setMessage("Não foi possível carregar as configurações salvas.");
    }
  }, []);
  function update(key: keyof Preferences, checked: boolean) {
    const next = { ...preferences, [key]: checked };
    try {
      localStorage.setItem("based-preferences", JSON.stringify(next));
      setPreferences(next);
      setMessage("Configurações salvas neste dispositivo.");
    } catch (error) {
      console.error("Não foi possível salvar configurações.", error);
      setMessage("Não foi possível salvar as configurações.");
    }
  }
  function reset() {
    try {
      localStorage.removeItem("based-preferences");
      setPreferences(defaults);
      setMessage("Configurações restauradas.");
    } catch (error) {
      console.error("Não foi possível restaurar configurações.", error);
      setMessage("Não foi possível restaurar as configurações.");
    }
  }
  return <>
    <header className="settings-heading">
      <div className="settings-heading-icon"><LockKeyhole size={22} /></div>
      <div><h1>Configurações</h1><p className="muted">Gerencie suas notificações e a privacidade do seu perfil.</p></div>
    </header>
    <section className="panel settings">
      <div className="settings-section-title"><Bell size={19} /><div><h2>Notificações</h2><p>Escolha quais avisos você quer receber.</p></div></div>
      {notificationRows.map(([key, title, description]) =>
        <PreferenceRow key={key} preference={key} title={title} description={description} value={preferences[key]} onChange={update} />,
      )}
    </section>
    <section className="panel settings">
      <div className="settings-section-title"><Eye size={19} /><div><h2>Privacidade</h2><p>Controle como outras pessoas veem seu perfil.</p></div></div>
      {privacyRows.map(([key, title, description]) =>
        <PreferenceRow key={key} preference={key} title={title} description={description} value={preferences[key]} onChange={update}
          icon={key === "showLocation" ? <MapPin size={16} /> : undefined} />,
      )}
    </section>
    <div className="settings-footer">
      <p role="status" aria-live="polite">{message}</p>
      <button className="button secondary" type="button" onClick={reset}><RotateCcw size={16} /> Restaurar padrões</button>
    </div>
  </>;
}

function PreferenceRow({
  preference, title, description, value, onChange, icon,
}: {
  preference: keyof Preferences;
  title: string;
  description: string;
  value: boolean;
  onChange: (key: keyof Preferences, checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="setting">
      {icon}
      <span className="setting-copy"><strong>{title}</strong><small>{description}</small></span>
      <input type="checkbox" checked={value} onChange={(event) => onChange(preference, event.target.checked)} />
    </label>
  );
}
