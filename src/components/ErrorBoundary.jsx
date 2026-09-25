import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('Error de interfaz:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="app-error" role="alert">
      <span>Pedacito de Cielo</span>
      <h1>No pudimos mostrar esta página</h1>
      <p>Intenta cargar nuevamente. Si el problema continúa, vuelve al inicio.</p>
      <div><button type="button" onClick={() => window.location.reload()}>Reintentar</button><a href="/">Volver al inicio</a></div>
    </main>;
  }
}
