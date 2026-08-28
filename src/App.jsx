import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
export default function App(){return <BrowserRouter><AuthProvider><Routes><Route path="/" element={<Home/>}/><Route path="/admin/login" element={<Login/>}/><Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AuthProvider></BrowserRouter>}
