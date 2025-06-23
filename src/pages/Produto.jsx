import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from'../components/Loading'

export default function Produtos() {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) navigate('/');

  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [novoStock, setNovoStock] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [isloading, setIsloading] = useState(true);

  const buscarProdutos = async () => {
    try {
      const res = await api.get('/produtos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao buscar produtos');
    } finally {
      setIsloading(false)
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;

    setIsloading(true)

    try {
      await api.delete(`/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      buscarProdutos();
    } catch (err) {
      console.error('Erro ao excluir produto');
    } finally {
      setIsloading(false)
    }
  };

  const abrirModal = (produto) => {
    setProdutoAtual(produto);
    setNovoStock(produto.stock);
    setNovoPreco(produto.preco);
    setModalAberto(true);
  };

  const salvarEdicao = async () => {
    setIsloading(true)

    try {
      await api.put(
        `/produtos/${produtoAtual.id}`,
        {
          novoStock: novoStock,
          novoPrecoCompra: novoPreco,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalAberto(false);
      buscarProdutos();
    } catch (err) {
      console.error('Erro ao atualizar produto');
    }finally{
      setIsloading(false)
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div className="w-full min-h-screen mx-auto mt-10 bg-gray-900 p-6 rounded-xl text-white shadow-lg">

      {isloading? <Loading message="Carregando Produtos..."/>: ""}
      <h2 className="text-center text-teal-400 text-2xl font-semibold mb-6">Produtos Cadastrados</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Preço</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod) => (
              <tr key={prod.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{prod.id}</td>
                <td className="p-3">{prod.nome}</td>
                <td className="p-3">{prod.stock}</td>
                <td className="p-3">{prod.preco} MZN</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => abrirModal(prod)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => excluirProduto(prod.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                  >
                    🗑️ Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80 animate-scale-in">
            <h3 className="text-lg font-semibold mb-4 text-center">Editar Produto</h3>
            <label className="block mb-1">Stock:</label>
            <input
              type="number"
              value={novoStock}
              onChange={(e) => setNovoStock(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            <label className="block mb-1">Preço:</label>
            <input
              type="number"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={salvarEdicao}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md"
              >
                💾 Salvar
              </button>
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-md"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
