import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { Logo } from "../Shell";

export default function Login() {
  return <div className="auth-page"><div className="auth-card">
    <a className="button secondary back-button" href="/"><ArrowLeft size={18} />Voltar</a>
    <Logo href="/" /><h1>Bem-vindo de volta!</h1><p>Entre na sua conta para continuar.</p>
    <form onSubmit={(event) => { event.preventDefault(); location.href = "/home"; }}>
      <label className="field"><Mail size={18} /><input type="email" placeholder="E-mail" required /></label>
      <label className="field"><LockKeyhole size={18} /><input type="password" placeholder="Senha" required /></label>
      <button className="button">Entrar</button>
    </form>
    <a href="/cadastro">Criar conta</a><small>Esqueceu sua senha?</small>
  </div></div>;
}
