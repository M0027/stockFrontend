
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroLoja from './pages/CadastroLoja';
import AdminLogin from './pages/AdminLogin';
import Produtos from './pages/Produto';
import Dashboard from './pages/Dashboade';
import LoginLoja from './pages/Login';
import CategoriaManager from './pages/CategoriaManager';

import { useEffect, useState } from 'react';
import AddProduto from './pages/AddProduto';
import AddVenda from './pages/AddVenda';
import Vendas from './pages/Vendas';

export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  const token = sessionStorage.getItem('token');

  useEffect(() => {

    if (token) {
      setAutenticado(true);
    }else{
      // setAutenticado(false)
    }
  }, []);

  const RotaProtegida = ({ children }) => {
    return autenticado ? children : <Navigate to="/" />;
  };


  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<LoginLoja />} />
        <Route path="/cadastro" element={<CadastroLoja />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Páginas protegidas (usuário comum / loja) */}
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
            
          }
        />
        <Route
          path="/produtos"
          element={
            <RotaProtegida>
              <Produtos />
            </RotaProtegida>
          }
        />
        <Route
          path="/add-produto"
          element={
            <RotaProtegida>
              <AddProduto />
            </RotaProtegida>
          }
        />
        <Route
          path="/add-venda"
          element={
            <RotaProtegida>
              <AddVenda />
            </RotaProtegida>
          }
        />
        <Route
          path="/categoria"
          element={
            <RotaProtegida>
              <CategoriaManager />
            </RotaProtegida>
          }
        />

        <Route
          path="/vendas"
          element={
            <RotaProtegida>
              <Vendas />
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}
