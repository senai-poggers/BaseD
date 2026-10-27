export type Team = {
  id: string;
  name: string;
  info: string;
  city: string;
  dist: string;
};

export type Event = {
  id: string;
  nome: string;
  tipo: string;
  info: string;
  datas: string;
  local: string;
  vagas: number;
};

export type Opening = {
  id: string;
  pos: string;
  tags: string[];
  qtd: number;
  data: string;
  candidatos: number;
  time: string;
};

export type ProfileData = {
  name: string;
  avatar: string | null;
  city: string;
  sport: string;
  position: string;
  level: string;
  bio: string;
};

export type ProfilePhoto = {
  id: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  liked: boolean;
  pinned: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  type: "Evento" | "Campeonato";
  place: string;
  year: string;
};

export type Preferences = {
  eventNotifications: boolean;
  matchNotifications: boolean;
  activityNotifications: boolean;
  publicProfile: boolean;
  showLocation: boolean;
};

export type AccountType = "atleta" | "time" | "organizador";

type AuthResponse = {
  usuario: { id: number; nome: string; email: string; tipo_perfil: AccountType; cidade: string };
  token: string;
};

const apiBase = import.meta.env["VITE_API_URL"] || "/api";
const tokenKey = "based-session-token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = sessionStorage.getItem(tokenKey);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (response.status === 204) return undefined as T;

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "mensagem" in result &&
      typeof result.mensagem === "string"
      ? result.mensagem
      : "Não foi possível concluir a solicitação.";
    throw new ApiError(message, response.status);
  }
  return result as T;
}

function json(body: unknown): string {
  return JSON.stringify(body);
}

function saveSession(response: AuthResponse) {
  sessionStorage.setItem(tokenKey, response.token);
}

export async function register(input: {
  nome: string;
  email: string;
  senha: string;
  tipo_perfil: AccountType;
  cidade: string;
}) {
  const session = await request<AuthResponse>("/auth/cadastro", { method: "POST", body: json(input) });
  saveSession(session);
}

export async function login(email: string, senha: string) {
  const session = await request<AuthResponse>("/auth/login", { method: "POST", body: json({ email, senha }) });
  saveSession(session);
}

export function logout() {
  sessionStorage.removeItem(tokenKey);
}

export async function loadTeams(): Promise<Team[]> {
  return request("/times");
}

export async function loadEvents(filter = "todos", query = ""): Promise<Event[]> {
  const params = new URLSearchParams();
  if (filter !== "todos") params.set("tipo", filter);
  if (query.trim()) params.set("busca", query.trim());
  const suffix = params.size ? `?${params}` : "";
  return request(`/eventos${suffix}`);
}

export async function loadOpenings(): Promise<Opening[]> {
  return request("/vagas");
}

export async function applyToEvent(eventId: string) {
  return request("/inscricoes-eventos", {
    method: "POST",
    body: json({ evento_id: eventId })
  });
}

export async function applyToOpening(openingId: string) {
  return request("/candidaturas", {
    method: "POST",
    body: json({ vaga_id: openingId })
  });
}

export async function loadProfile(): Promise<ProfileData> {
  return request("/perfil");
}

export async function saveProfile(profile: ProfileData): Promise<ProfileData> {
  return request("/perfil", { method: "PUT", body: json(profile) });
}

export async function loadPhotos(): Promise<ProfilePhoto[]> {
  return request("/perfil/fotos");
}

export async function createPhoto(photo: Pick<ProfilePhoto, "image" | "title" | "description">) {
  return request<ProfilePhoto>("/perfil/fotos", { method: "POST", body: json(photo) });
}

export async function savePhoto(photo: ProfilePhoto) {
  return request<ProfilePhoto>(`/perfil/fotos/${encodeURIComponent(photo.id)}`, {
    method: "PUT",
    body: json({ image: photo.image, title: photo.title, description: photo.description })
  });
}

export async function setPhotoFlag(id: string, flag: "curtida" | "fixada", value: boolean) {
  return request<ProfilePhoto>(`/perfil/fotos/${encodeURIComponent(id)}/${flag}`, {
    method: "PATCH",
    body: json({ value })
  });
}

export async function deletePhoto(id: string) {
  return request<void>(`/perfil/fotos/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function loadAchievements(): Promise<Achievement[]> {
  return request("/perfil/conquistas");
}

export async function saveAchievement(achievement: Omit<Achievement, "id"> & { id?: string }) {
  const path = achievement.id ? `/perfil/conquistas/${encodeURIComponent(achievement.id)}` : "/perfil/conquistas";
  return request<Achievement>(path, { method: achievement.id ? "PUT" : "POST", body: json(achievement) });
}

export async function deleteAchievement(id: string) {
  return request<void>(`/perfil/conquistas/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function loadPreferences(): Promise<Preferences> {
  return request("/preferencias");
}

export async function savePreferences(preferences: Preferences): Promise<Preferences> {
  return request("/preferencias", { method: "PUT", body: json(preferences) });
}

export async function resetPreferences(): Promise<Preferences> {
  return request("/preferencias", { method: "DELETE" });
}
