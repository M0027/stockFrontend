
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroLoja from './pages/CadastroLoja';
import AdminLogin from './pages/AdminLogin';
import Produtos from './pages/Produto';
import Dashboard from './pages/Dashboade';
import LoginLoja from './pages/Login';
import CategoriaManager from './pages/CategoriaManager';
import AddProduto from './pages/AddProduto';
import AddVenda from './pages/AddVenda';
import Vendas from './pages/Vendas';

export default function App() {


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

            <Produtos />

          }
        />
        <Route
          path="/add-produto"
          element={

            <AddProduto />

          }
        />
        <Route
          path="/add-venda"
          element={

            <AddVenda />

          }
        />
        <Route
          path="/categoria"
          element={

            <CategoriaManager />
          }
        />

        <Route
          path="/vendas"
          element={

            <Vendas />

          }
        />
      </Routes>
    </Router >
  );
}
