import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaS } from 'react-icons/fa6';
import Loading from '../components/Loading'

export default function CategoriaManager() {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) navigate('/');

  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [isloading, setIsloading] = useState(true);

  const carregarCategorias = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await api.get("/categorias", { headers });
      setCategorias(res.data);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    } finally {
      setIsloading(false)
    }
  };

  const adicionarCategoria = async (e) => {

    setIsloading(true)
    e.preventDefault();
    if (!novaCategoria.trim()) return;

    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      await api.post("/categorias", { nome: novaCategoria }, { headers });
      setNovaCategoria("");
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao adicionar categoria", err);
    } finally {
      setIsloading(false)
    }
  };

  const deletarCategoria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    setIsloading(true)

    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      await api.delete(`/categorias/${id}`, { headers });
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao excluir categoria", err);
    } finally {
      setIsloading(false)
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center z-10 bg-black text-white px-4 py-8">

      <div className="w-full max-w-md bg-zinc-900 p-6 z-20 rounded-lg">

      
        <h2 className="text-center text-2xl font-bold mb-4">Gerenciar Categorias</h2>

        <form
          onSubmit={adicionarCategoria}
          className="flex gap-2 mb-4"
          >
          <input
            type="text"
            placeholder="Nova categoria"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            required
            className="flex-1 p-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-transform duration-200 transform focus:scale-105"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-transform duration-200 transform hover:scale-105"
            >
            Adicionar
          </button>
        </form>
            { isloading? <Loading message="Aguar um momento..."/>:""}

        <ul className="space-y-2">
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
            >
              <span>{cat.nome}</span>
              <button
                onClick={() => deletarCategoria(cat.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
