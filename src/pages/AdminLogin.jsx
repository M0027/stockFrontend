import { useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading'

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState('');
  const [lojas, setLojas] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const login = async () => {

    setIsloading(true)
    try {
      const res = await api.post('/admin/login', { email, senha });
      setToken(res.data.token);
    } catch (err) {
      alert('Login falhou');
    } finally {
      setIsloading(false)
    }
  };

  const buscarLojas = async () => {
    setIsloading(true)
    try {
      const res = await api.get('/admin/lojas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLojas(res.data);
    } catch (err) {
      alert('Erro ao buscar lojas');
    } finally {
      setIsloading(false)
    }
  };

  const ativarLoja = async (id) => {
    setIsloading(true)
    try {
      await api.put(`/admin/lojas/ativar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      buscarLojas();
    } catch (err) {
      alert('Erro ao ativar loja');
    } finally {
      setIsloading(false)
    }
  };

  const desativarLoja = async (id) => {
    setIsloading(true)
    try {
      await api.put(`/admin/lojas/desativar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      buscarLojas();
    } catch (err) {
      alert('Erro ao ativar loja');
    } finally {
      setIsloading(false)
    }
  };

  console.log('lojas', lojas)

  return (
    <div className="w-full h-screen mx-auto mt-10 p-6 bg-zinc-900 text-white rounded-xl shadow-lg justify-center items-center flex">

      { isloading? <Loading message='Aguarde...'/> :""}

      {!token ? (
        <div className='max-w-xl'>
          <h2 className="text-2xl font-bold text-teal-400 text-center mb-6">Login do Administrador</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white focus:outline-none"
          />
          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-zinc-800 text-white focus:outline-none"
          />
          <button
            onClick={login}
            className="w-full bg-teal-500 hover:bg-teal-600 transition duration-300 p-3 rounded-lg font-bold"
          >
            Entrar
          </button>
        </div>
      ) : (
        <div className='w-full max-h-dvh overflow-auto scrollbar-hide'>
          <h2 className="text-2xl font-bold text-teal-400 text-center mb-6">Painel Admin - Lojas Registradas</h2>
          <button
            onClick={buscarLojas}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
          >
            🔄 Atualizar Lista
          </button>

          <ul className="space-y-3">
            {lojas.map(loja => (
              <li
                key={loja.id}
                className="bg-zinc-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
              >
                <div>
                  <span className="block font-semibold">{loja.nome_loja} ({loja.email})</span>
                  <span className="block text-sm">Dias: {loja.dias_desde_cadastro}</span>
                  <span className="block text-sm">Plano: {loja.status_pagamento == true ? '✅ Ativo' : '❌ Inativo'}</span>
                </div>
                {!loja.status_pagamento == 1 && (
                  <button
                    onClick={() => ativarLoja(loja.id)}
                    className="bg-green-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Ativar
                  </button>
                )}

                {loja.status_pagamento == 1 && (
                  <button
                    onClick={() => desativarLoja(loja.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Desativar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
