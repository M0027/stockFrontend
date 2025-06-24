
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroLoja from './pages/CadastroLoja.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Produtos from './pages/Produto.jsx';
import Dashboard from './pages/Dashboade.jsx';
import LoginLoja from './pages/Login.jsx';
import CategoriaManager from './pages/CategoriaManager.jsx';
import AddProduto from './pages/AddProduto.jsx';
import AddVenda from './pages/AddVenda.jsx';
import Vendas from './pages/Vendas.jsx';

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
