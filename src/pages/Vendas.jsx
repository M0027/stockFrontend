import { useEffect, useState } from "react";
import api from "../services/api";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loading from '../components/Loading';

export default function Vendas() {
    const [vendas, setVendas] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const [produtos, setProdutos] = useState([]);


    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    if (!token) navigate("/");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const buscarVendas = async () => {
        try {
            const res = await api.get("/vendas", { headers });
            setVendas(res.data);
        } catch (err) {
            console.error("Erro ao buscar vendas", err);
        }
    };

    const excluirVenda = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja excluir esta venda?");
        if (!confirm) return;



        try {

            setIsloading(true)
            await api.delete(`/vendas/${id}`, { headers });
            buscarVendas(); // Atualiza a lista após excluir
        } catch (err) {
            console.error("Erro ao excluir venda", err);
        }finally{
            setIsloading(false)
        }
    };

    const buscarLojas = async () => {
        try {
            const res = await api.get('/produtos', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProdutos(res.data);
            // console.log('produtos:', res.data)
        } catch (err) {
            alert('Erro ao buscar produtos');
        } finally {
            setIsloading(false)
        }
    };


    useEffect(() => {
        buscarVendas();
        buscarLojas();

    }, []);


        const nomeProduto = (produto_id) =>{
        const datas = produtos?.length > 0? produtos?.find(item => item.id === produto_id) : [];
        return datas

        // console.log('dados:', datas)



        }

        // nomeProduto(25)


    return (

        <div className="min-h-screen w-full bg-[#003366] text-white p-4">

            {
                isLoading ? <Loading message='Aguarde enquanto Carrega...'/>:""}

                
                    <div className="bg-gray-100 text-[#003366] p-6 rounded-xl max-w-6xl mx-auto mt-10">
                        <h2 className="text-3xl text-center font-bold mb-6">Lista de Vendas</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-[#003366] text-left">
                                <thead>
                                    <tr>
                                        <th className="border border-[#003366] p-3">Produto</th>
                                        <th className="border border-[#003366] p-3">Quantidade</th>
                                        <th className="border border-[#003366] p-3">Valor Total</th>
                                        <th className="border border-[#003366] p-3">Data da Venda</th>
                                        <th className="border border-[#003366] p-3">Categoria</th>
                                        <th className="border border-[#003366] p-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendas?.length > 0 ? (
                                        vendas?.map((venda) => (
                                            <tr key={venda.id}>
                                                <td className="border border-[#003366] p-3">{nomeProduto(venda.produto_id).nome}</td>
                                                <td className="border border-[#003366] p-3">{venda.quantidade}</td>
                                                <td className="border border-[#003366] p-3">{venda.total} MT</td>
                                                <td className="border border-[#003366] p-3">{venda.data_venda}</td>
                                                <td className="border border-[#003366] p-3">{nomeProduto(venda.produto_id).categoria_nome}</td>
                                                <td className="border border-[#003366] p-3">
                                                    <button
                                                        onClick={() => excluirVenda(venda.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                                                    >
                                                        <FiTrash2 /> Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">
                                                Nenhuma venda registrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
            
        </div>
    );
}
