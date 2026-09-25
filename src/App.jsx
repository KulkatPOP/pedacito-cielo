import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Home from './pages/Home.jsx';

const Login=lazy(()=>import('./pages/Login.jsx'));
const Admin=lazy(()=>import('./pages/Admin.jsx'));
const adminFallback=<div className="site-loading">Cargando administración…</div>;

export default function App(){return <BrowserRouter><ErrorBoundary><AuthProvider><Routes><Route path="/" element={<Home/>}/><Route path="/admin/login" element={<Suspense fallback={adminFallback}><Login/></Suspense>}/><Route path="/admin" element={<ProtectedRoute><Suspense fallback={adminFallback}><Admin/></Suspense></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider></ErrorBoundary></BrowserRouter>}
