import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/account.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountSettings() {
  const { user, updateEmail, updatePassword } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirmation: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setMessage(null);
    const email = form.email.trim();
    const wantsEmail = Boolean(email) && email.toLowerCase() !== user?.email?.toLowerCase();
    const wantsPassword = Boolean(form.password || form.confirmation);

    if (!wantsEmail && !wantsPassword) {
      setMessage({ type: 'error', text: 'Ingresa un correo nuevo o una contraseña nueva.' });
      return;
    }
    if (email && !emailPattern.test(email)) {
      setMessage({ type: 'error', text: 'Ingresa un correo electrónico válido.' });
      return;
    }
    if (wantsPassword && form.password.length < 8) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (wantsPassword && form.password !== form.confirmation) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setBusy(true);
    if (wantsEmail) {
      const { error } = await updateEmail(email);
      if (error) {
        setBusy(false);
        setMessage({ type: 'error', text: `No fue posible actualizar el correo. ${error.message}` });
        return;
      }
    }
    if (wantsPassword) {
      const { error } = await updatePassword(form.password);
      if (error) {
        setBusy(false);
        setMessage({ type: 'error', text: `No fue posible actualizar la contraseña. ${error.message}` });
        return;
      }
    }

    setBusy(false);
    setForm({ email: '', password: '', confirmation: '' });
    setMessage({
      type: 'success',
      text: wantsEmail && !wantsPassword
        ? 'Correo actualizado. Supabase puede solicitar confirmación en la dirección nueva y en la anterior.'
        : wantsPassword && !wantsEmail
          ? 'Contraseña actualizada correctamente.'
          : 'Datos de acceso actualizados correctamente. Confirma el nuevo correo si recibes un mensaje de Supabase.',
    });
  }

  return <div className="account-page">
    <div className="account-intro"><span>Configuración</span><h2>Cuenta administrador</h2><p>Administra de forma segura los datos utilizados para ingresar al panel.</p></div>
    <section className="admin-card account-card">
      <div className="account-card-heading"><div className="account-shield">✓</div><div><h2>Seguridad de cuenta</h2><p>Desde aquí puedes actualizar los datos utilizados para ingresar al panel administrador.</p></div></div>
      <div className="current-account"><small>Correo actual</small><strong>{user?.email || 'No disponible'}</strong><span>Cuenta autenticada mediante Supabase Auth</span></div>
      <form className="account-form" onSubmit={submit} noValidate>
        <label>Nuevo correo electrónico<input type="email" autoComplete="email" placeholder="nuevo@correo.com" value={form.email} onChange={(event) => change('email', event.target.value)}/><small>Déjalo vacío si no deseas cambiarlo.</small></label>
        <div className="account-password-grid">
          <label>Nueva contraseña<input type="password" autoComplete="new-password" minLength="8" placeholder="Mínimo 8 caracteres" value={form.password} onChange={(event) => change('password', event.target.value)}/></label>
          <label>Confirmar contraseña<input type="password" autoComplete="new-password" minLength="8" placeholder="Repite la contraseña" value={form.confirmation} onChange={(event) => change('confirmation', event.target.value)}/></label>
        </div>
        <div className="account-security-note"><b>Protección de datos</b><p>La contraseña nunca se muestra ni se guarda en la base de datos del negocio. Supabase Auth procesa el cambio para esta sesión autenticada.</p></div>
        {message && <div role="status" className={`account-message ${message.type}`}>{message.text}</div>}
        <button className="cms-primary" disabled={busy}>{busy ? 'Guardando cambios…' : 'Guardar cambios'}</button>
      </form>
    </section>
  </div>;
}
