import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  BadgeCheck,
  Camera,
  Heart,
  Image,
  MapPin,
  Pencil,
  Pin,
  Plus,
  Trash2,
  Trophy,
  UserRoundCheck,
  X,
} from "lucide-react";

type ProfileData = {
  name: string;
  avatar: string | null;
  city: string;
  sport: string;
  position: string;
  level: string;
  bio: string;
};

type ProfilePhoto = {
  id: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  liked: boolean;
  pinned: boolean;
};

type PhotoDraft = Pick<ProfilePhoto, "image" | "title" | "description"> & { id?: string };

type Achievement = {
  id: string;
  title: string;
  type: "Evento" | "Campeonato";
  place: string;
  year: string;
};

type AchievementDraft = Omit<Achievement, "id"> & { id?: string };

const defaultProfile: ProfileData = {
  name: "João Victor",
  avatar: null,
  city: "Palhoça - SC",
  sport: "Futebol",
  position: "Atacante",
  level: "Amador",
  bio: "Atleta dedicado, buscando oportunidades para evoluir e mostrar meu futebol. Disponível para novos desafios.",
};

const defaultAchievements: Achievement[] = [{
  id: "municipal-championship",
  title: "Participação no Campeonato Municipal",
  type: "Campeonato",
  place: "Palhoça",
  year: "2024",
}];

const tabs = [
  ["Sobre", UserRoundCheck],
  ["Fotos", Image],
  ["Conquistas", Trophy],
] as const;

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AT";
}

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Formato de imagem inválido."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function readPhotos(): ProfilePhoto[] {
  const saved = localStorage.getItem("based-profile-photos");
  if (!saved) return [];
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error("Galeria de fotos inválida.");
  return parsed.map((item): ProfilePhoto => {
    if (typeof item !== "object" || item === null) throw new Error("Foto inválida na galeria.");
    const photo = item as Record<string, unknown>;
    if (
      typeof photo.id !== "string" ||
      typeof photo.image !== "string" ||
      typeof photo.title !== "string" ||
      typeof photo.description !== "string" ||
      typeof photo.likes !== "number" ||
      typeof photo.liked !== "boolean" ||
      typeof photo.pinned !== "boolean"
    ) {
      throw new Error("Dados inválidos em uma foto da galeria.");
    }
    return {
      id: photo.id,
      image: photo.image,
      title: photo.title,
      description: photo.description,
      likes: photo.likes,
      liked: photo.liked,
      pinned: photo.pinned,
    };
  });
}

function readAchievements(): Achievement[] {
  const saved = localStorage.getItem("based-profile-achievements");
  if (!saved) return defaultAchievements;
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error("Lista de conquistas inválida.");
  return parsed.map((item): Achievement => {
    if (typeof item !== "object" || item === null) throw new Error("Conquista inválida.");
    const achievement = item as Record<string, unknown>;
    if (
      typeof achievement.id !== "string" ||
      typeof achievement.title !== "string" ||
      (achievement.type !== "Evento" && achievement.type !== "Campeonato") ||
      typeof achievement.place !== "string" ||
      typeof achievement.year !== "string"
    ) {
      throw new Error("Dados inválidos em uma conquista.");
    }
    return {
      id: achievement.id,
      title: achievement.title,
      type: achievement.type,
      place: achievement.place,
      year: achievement.year,
    };
  });
}

function readProfile(): ProfileData {
  const saved = localStorage.getItem("based-profile");
  if (!saved) return defaultProfile;
  const parsed: unknown = JSON.parse(saved);
  if (typeof parsed !== "object" || parsed === null) throw new Error("Dados do perfil inválidos.");
  const value = parsed as Record<string, unknown>;
  const profile = { ...defaultProfile };
  for (const key of ["name", "city", "sport", "position", "level", "bio"] as const) {
    const field = value[key];
    if (typeof field !== "string") throw new Error(`Campo inválido no perfil: ${key}.`);
    profile[key] = field;
  }
  if (value.avatar !== undefined && value.avatar !== null && typeof value.avatar !== "string") {
    throw new Error("Foto de perfil inválida.");
  }
  profile.avatar = typeof value.avatar === "string" ? value.avatar : null;
  return profile;
}

export default function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("Sobre");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementDraft, setAchievementDraft] = useState<AchievementDraft | null>(null);
  const [photoDraft, setPhotoDraft] = useState<PhotoDraft | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const draftAvatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>, saveImmediately: boolean) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setMessage("Escolha uma imagem JPG, PNG ou WebP de até 1 MB.");
      return;
    }

    try {
      const avatar = await readImage(file);

      if (saveImmediately) {
        const updatedProfile = { ...profile, avatar };
        localStorage.setItem("based-profile", JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        setDraft(updatedProfile);
        setMessage("Foto de perfil atualizada neste dispositivo.");
      } else {
        setDraft((current) => ({ ...current, avatar }));
        setMessage("Foto selecionada. Salve o perfil para aplicar.");
      }
    } catch (error) {
      console.error("Não foi possível atualizar a foto do perfil.", error);
      setMessage("Não foi possível salvar a foto. Tente uma imagem menor.");
    }
  }

  useEffect(() => {
    try {
      setProfile(readProfile());
    } catch (error) {
      console.error("Não foi possível carregar o perfil.", error);
      setMessage("Não foi possível carregar os dados salvos do perfil.");
    }
    try {
      setPhotos(readPhotos());
    } catch (error) {
      console.error("Não foi possível carregar as fotos do perfil.", error);
      setMessage("Não foi possível carregar as fotos salvas do perfil.");
    }
    try {
      setAchievements(readAchievements());
    } catch (error) {
      console.error("Não foi possível carregar as conquistas do perfil.", error);
      setMessage("Não foi possível carregar as conquistas salvas.");
    }
  }, []);

  useEffect(() => {
    if (!avatarPreview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAvatarPreview(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [avatarPreview]);

  async function handlePhotoSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setMessage("Escolha uma imagem JPG, PNG ou WebP de até 1 MB.");
      return;
    }
    try {
      setPhotoDraft({ image: await readImage(file), title: "", description: "" });
    } catch (error) {
      console.error("Não foi possível ler a foto selecionada.", error);
      setMessage("Não foi possível abrir essa foto. Tente outro arquivo.");
    }
  }

  function savePhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photoDraft) return;
    const updatedPhotos = photoDraft.id
      ? photos.map((photo) => photo.id === photoDraft.id ? { ...photo, ...photoDraft } : photo)
      : [...photos, {
          ...photoDraft,
          id: crypto.randomUUID(),
          likes: 0,
          liked: false,
          pinned: false,
        }];
    try {
      localStorage.setItem("based-profile-photos", JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
      setPhotoDraft(null);
      setMessage(photoDraft.id ? "Foto atualizada." : "Foto adicionada ao seu perfil.");
    } catch (error) {
      console.error("Não foi possível salvar a foto do perfil.", error);
      setMessage("Não foi possível salvar. O armazenamento do navegador pode estar cheio.");
    }
  }

  function deletePhoto(id: string) {
    const updatedPhotos = photos.filter((photo) => photo.id !== id);
    try {
      localStorage.setItem("based-profile-photos", JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
      setMessage("Foto excluída do perfil.");
    } catch (error) {
      console.error("Não foi possível excluir a foto do perfil.", error);
      setMessage("Não foi possível excluir a foto. Verifique o armazenamento do navegador.");
    }
  }

  function updatePhoto(id: string, update: (photo: ProfilePhoto) => ProfilePhoto, successMessage: string) {
    const updatedPhotos = photos.map((photo) => photo.id === id ? update(photo) : photo);
    try {
      localStorage.setItem("based-profile-photos", JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
      setMessage(successMessage);
    } catch (error) {
      console.error("Não foi possível atualizar a foto do perfil.", error);
      setMessage("Não foi possível atualizar a foto. Verifique o armazenamento do navegador.");
    }
  }

  function saveAchievement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!achievementDraft) return;
    const achievement: Achievement = {
      ...achievementDraft,
      id: achievementDraft.id ?? crypto.randomUUID(),
    };
    const updatedAchievements = achievementDraft.id
      ? achievements.map((item) => item.id === achievement.id ? achievement : item)
      : [...achievements, achievement];
    try {
      localStorage.setItem("based-profile-achievements", JSON.stringify(updatedAchievements));
      setAchievements(updatedAchievements);
      setAchievementDraft(null);
      setMessage(achievementDraft.id ? "Conquista atualizada." : "Conquista adicionada.");
    } catch (error) {
      console.error("Não foi possível salvar a conquista.", error);
      setMessage("Não foi possível salvar a conquista. Verifique o armazenamento do navegador.");
    }
  }

  function deleteAchievement(id: string) {
    const updatedAchievements = achievements.filter((item) => item.id !== id);
    try {
      localStorage.setItem("based-profile-achievements", JSON.stringify(updatedAchievements));
      setAchievements(updatedAchievements);
      setMessage("Conquista excluída.");
    } catch (error) {
      console.error("Não foi possível excluir a conquista.", error);
      setMessage("Não foi possível excluir a conquista. Verifique o armazenamento do navegador.");
    }
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem("based-profile", JSON.stringify(draft));
      setProfile(draft);
      setEditing(false);
      setMessage("Perfil atualizado neste dispositivo.");
    } catch (error) {
      console.error("Não foi possível salvar o perfil.", error);
      setMessage("Não foi possível salvar. Verifique o armazenamento do navegador.");
    }
  }

  function cancelEditing() {
    setDraft(profile);
    setEditing(false);
  }

  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <div>
          <p className="eyebrow">MINHA CONTA</p>
          <h1>Meu perfil</h1>
          <p className="muted">Mostre sua trajetória e conecte-se com novos times.</p>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            setDraft(profile);
            setEditing(true);
          }}
        >
          <Pencil size={16} /> Editar perfil
        </button>
      </header>

      <section className="panel profile-card">
        <div className="profile-cover">
          <span className="profile-cover-label"><Camera size={14} /> Perfil de atleta</span>
        </div>
        <div className="profile-card-body">
          <div className="profile-avatar">
            {profile.avatar ? (
              <button
                className="profile-avatar-image"
                type="button"
                aria-label={`Ampliar foto de perfil de ${profile.name}`}
                onClick={() => setAvatarPreview(true)}
              >
                <img src={profile.avatar} alt="" />
              </button>
            ) : initials(profile.name)}
            <button className="profile-avatar-camera" type="button" aria-label="Alterar foto de perfil" onClick={() => avatarInputRef.current?.click()}><Camera size={15} /></button>
            <input
              ref={avatarInputRef}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Selecionar foto de perfil"
              onChange={(event) => void handleAvatarChange(event, true)}
            />
          </div>
          <div className="profile-main-info">
            <h2>{profile.name} <BadgeCheck size={19} aria-label="Perfil verificado" /></h2>
            <p><MapPin size={15} /> {profile.city} <span className="profile-dot">·</span> {profile.sport} | {profile.position}</p>
            <div className="profile-tags">
              {[profile.sport, profile.position, profile.level].map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          <div className="profile-actions">
            <div className="profile-stats">
              <span><strong>12</strong><small>Curtidas</small></span>
              <span><strong>3</strong><small>Comentários</small></span>
              <span><strong>5</strong><small>Seguidores</small></span>
            </div>
          </div>
        </div>
      </section>

      <nav className="profile-tabs" aria-label="Seções do perfil">
        {tabs.map(([label, Icon]) => (
          <button
            key={label}
            className={tab === label ? "selected" : ""}
            type="button"
            onClick={() => setTab(label)}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      <section className="profile-content">
        {tab === "Sobre" && (
          <div className="profile-about-grid">
            <article className="panel profile-about">
              <h3>Sobre mim</h3>
              <p>{profile.bio}</p>
              <div className="profile-details">
                <span><MapPin size={16} /> {profile.city}</span>
                <span><UserRoundCheck size={16} /> {profile.sport} · {profile.position}</span>
              </div>
            </article>
            <article className="panel profile-about">
              <h3><Trophy size={18} /> Experiência</h3>
              <div className="experience-item">
                <span className="experience-icon"><Trophy size={18} /></span>
                <div><strong>Campeonato Municipal</strong><p>Palhoça · 2024</p></div>
              </div>
            </article>
          </div>
        )}
        {tab === "Fotos" && (
          <div className="profile-gallery">
            <header className="profile-gallery-heading">
              <div><h2>Fotos do perfil</h2><p>Compartilhe momentos da sua trajetória.</p></div>
              <button className="button" type="button" onClick={() => photoInputRef.current?.click()}><Plus size={17} /> Adicionar foto</button>
              <input
                ref={photoInputRef}
                className="visually-hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Selecionar foto para a galeria"
                onChange={(event) => void handlePhotoSelection(event)}
              />
            </header>
            {photos.length === 0 ? (
              <article className="panel profile-empty">
                <Image size={28} />
                <h3>Nenhuma foto por aqui ainda</h3>
                <p>Adicione fotos para compartilhar momentos do seu esporte.</p>
              </article>
            ) : (
              <div className="profile-gallery-grid">
                {[...photos].sort((first, second) => Number(second.pinned) - Number(first.pinned)).map((photo) => (
                  <article className="panel profile-photo-card" key={photo.id}>
                    <img src={photo.image} alt={photo.title} />
                    <div className="profile-photo-copy">
                      {photo.pinned && <span className="profile-pinned-label"><Pin size={13} /> Fixada</span>}
                      <h3>{photo.title}</h3>
                      <p>{photo.description || "Sem descrição."}</p>
                      <footer>
                        <button
                          className={`profile-photo-action ${photo.liked ? "liked" : ""}`}
                          type="button"
                          aria-pressed={photo.liked}
                          aria-label={`${photo.liked ? "Descurtir" : "Curtir"} ${photo.title}`}
                          onClick={() => updatePhoto(photo.id, (current) => ({
                            ...current,
                            liked: !current.liked,
                            likes: current.likes + (current.liked ? -1 : 1),
                          }), photo.liked ? "Curtida removida." : "Foto curtida.")}
                        >
                          <Heart size={16} fill={photo.liked ? "currentColor" : "none"} /> {photo.likes}
                        </button>
                        <button
                          className={`profile-photo-action ${photo.pinned ? "pinned" : ""}`}
                          type="button"
                          aria-pressed={photo.pinned}
                          onClick={() => updatePhoto(photo.id, (current) => ({ ...current, pinned: !current.pinned }), photo.pinned ? "Foto desafixada." : "Foto fixada no início da galeria.")}
                        >
                          <Pin size={16} /> {photo.pinned ? "Desafixar" : "Fixar"}
                        </button>
                        <button
                          className="profile-photo-action"
                          type="button"
                          aria-label={`Editar ${photo.title}`}
                          onClick={() => setPhotoDraft({
                            id: photo.id,
                            image: photo.image,
                            title: photo.title,
                            description: photo.description,
                          })}
                        >
                          <Pencil size={16} /> Editar
                        </button>
                        <button
                          className="profile-photo-action profile-photo-delete"
                          type="button"
                          aria-label={`Excluir ${photo.title}`}
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 size={16} /> Excluir
                        </button>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "Conquistas" && (
          <div className="profile-achievements">
            <header className="profile-gallery-heading">
              <div><h2>Minhas conquistas</h2><p>Registre eventos e campeonatos que marcaram sua trajetória.</p></div>
              <button
                className="button"
                type="button"
                onClick={() => setAchievementDraft({ title: "", type: "Evento", place: "", year: "" })}
              >
                <Plus size={17} /> Adicionar conquista
              </button>
            </header>
            {achievements.length === 0 ? (
              <article className="panel profile-empty">
                <Trophy size={28} />
                <h3>Nenhuma conquista adicionada</h3>
                <p>Adicione eventos e campeonatos dos quais participou.</p>
              </article>
            ) : (
              <div className="panel profile-achievement-list">
                {achievements.map((achievement) => (
                  <article className="experience-item profile-achievement" key={achievement.id}>
                    <span className="experience-icon"><Trophy size={18} /></span>
                    <div className="profile-achievement-copy">
                      <strong>{achievement.title}</strong>
                      <p><span>{achievement.type}</span>{achievement.place && <> · {achievement.place}</>}{achievement.year && <> · {achievement.year}</>}</p>
                    </div>
                    <div className="profile-achievement-actions">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Editar ${achievement.title}`}
                        onClick={() => setAchievementDraft({ ...achievement })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Excluir ${achievement.title}`}
                        onClick={() => deleteAchievement(achievement.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <p className="profile-status" role="status" aria-live="polite">{message || "Seus dados de perfil ficam salvos neste dispositivo."}</p>

      {achievementDraft && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAchievementDraft(null);
        }}>
          <section className="panel profile-editor" role="dialog" aria-modal="true" aria-labelledby="achievement-editor-title">
            <header className="profile-editor-heading">
              <div><p className="eyebrow">MINHA TRAJETÓRIA</p><h2 id="achievement-editor-title">{achievementDraft.id ? "Editar conquista" : "Adicionar conquista"}</h2></div>
              <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setAchievementDraft(null)}><X size={19} /></button>
            </header>
            <form onSubmit={saveAchievement}>
              <label>Nome da conquista
                <input required maxLength={80} value={achievementDraft.title} onChange={(event) => setAchievementDraft({ ...achievementDraft, title: event.target.value })} />
              </label>
              <label>Tipo
                <select
                  value={achievementDraft.type}
                  onChange={(event) => {
                    const type = event.target.value;
                    if (type === "Evento" || type === "Campeonato") {
                      setAchievementDraft({ ...achievementDraft, type });
                    }
                  }}
                >
                  <option>Evento</option>
                  <option>Campeonato</option>
                </select>
              </label>
              <label>Local
                <input maxLength={60} value={achievementDraft.place} onChange={(event) => setAchievementDraft({ ...achievementDraft, place: event.target.value })} />
              </label>
              <label>Ano
                <input type="number" min="1900" max="2100" value={achievementDraft.year} onChange={(event) => setAchievementDraft({ ...achievementDraft, year: event.target.value })} />
              </label>
              <footer className="profile-editor-actions">
                <button className="button secondary" type="button" onClick={() => setAchievementDraft(null)}>Cancelar</button>
                <button className="button" type="submit">{achievementDraft.id ? "Salvar alterações" : "Adicionar conquista"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {avatarPreview && profile.avatar && (
        <div
          className="avatar-viewer"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setAvatarPreview(false);
          }}
        >
          <button className="avatar-viewer-close" type="button" aria-label="Fechar foto ampliada" onClick={() => setAvatarPreview(false)}><X size={22} /></button>
          <section className="avatar-viewer-image" role="dialog" aria-modal="true" aria-label={`Foto de perfil de ${profile.name}`}>
            <img src={profile.avatar} alt={`Foto de perfil de ${profile.name}`} />
            <strong>{profile.name}</strong>
          </section>
        </div>
      )}

      {photoDraft && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPhotoDraft(null);
        }}>
          <section className="panel profile-editor" role="dialog" aria-modal="true" aria-labelledby="photo-editor-title">
            <header className="profile-editor-heading">
              <div><p className="eyebrow">MINHA GALERIA</p><h2 id="photo-editor-title">{photoDraft.id ? "Editar foto" : "Adicionar foto"}</h2></div>
              <button className="icon-button" type="button" aria-label="Fechar" onClick={() => setPhotoDraft(null)}><X size={19} /></button>
            </header>
            <form onSubmit={savePhoto}>
              <img className="profile-photo-preview" src={photoDraft.image} alt="Prévia da foto selecionada" />
              <label>Título
                <input required maxLength={60} value={photoDraft.title} onChange={(event) => setPhotoDraft({ ...photoDraft, title: event.target.value })} />
              </label>
              <label>Descrição
                <textarea rows={3} maxLength={240} value={photoDraft.description} onChange={(event) => setPhotoDraft({ ...photoDraft, description: event.target.value })} />
              </label>
              <footer className="profile-editor-actions">
                <button className="button secondary" type="button" onClick={() => setPhotoDraft(null)}>Cancelar</button>
                <button className="button" type="submit">{photoDraft.id ? "Salvar alterações" : "Adicionar foto"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) cancelEditing();
        }}>
          <section className="panel profile-editor" role="dialog" aria-modal="true" aria-labelledby="profile-editor-title">
            <header className="profile-editor-heading">
              <div><p className="eyebrow">MINHA CONTA</p><h2 id="profile-editor-title">Editar perfil</h2></div>
              <button className="icon-button" type="button" aria-label="Fechar" onClick={cancelEditing}><X size={19} /></button>
            </header>
            <form onSubmit={saveProfile}>
              <div className="profile-photo-field">
                {draft.avatar
                  ? <img src={draft.avatar} alt={`Prévia da foto de ${draft.name}`} />
                  : <span>{initials(draft.name)}</span>}
                <div>
                  <strong>Foto de perfil</strong>
                  <p>JPG, PNG ou WebP. Até 1 MB.</p>
                  <button className="button secondary" type="button" onClick={() => draftAvatarInputRef.current?.click()}>Escolher foto</button>
                  {draft.avatar && <button className="profile-remove-photo" type="button" onClick={() => setDraft({ ...draft, avatar: null })}>Remover foto</button>}
                  <input
                    ref={draftAvatarInputRef}
                    className="visually-hidden"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label="Selecionar foto para o perfil"
                    onChange={(event) => void handleAvatarChange(event, false)}
                  />
                </div>
              </div>
              <label>Nome completo
                <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </label>
              <label>Cidade e estado
                <input required value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} />
              </label>
              <div className="profile-editor-fields">
                <label>Esporte
                  <input required value={draft.sport} onChange={(event) => setDraft({ ...draft, sport: event.target.value })} />
                </label>
                <label>Posição
                  <input required value={draft.position} onChange={(event) => setDraft({ ...draft, position: event.target.value })} />
                </label>
              </div>
              <label>Nível
                <input required value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })} />
              </label>
              <label>Sobre mim
                <textarea rows={4} maxLength={300} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
              </label>
              <footer className="profile-editor-actions">
                <button className="button secondary" type="button" onClick={cancelEditing}>Cancelar</button>
                <button className="button" type="submit">Salvar perfil</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
