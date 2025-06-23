import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Package, Tags, Layers3, DollarSign } from "lucide-react";
import { FaMoneyBillWave } from "react-icons/fa";
import Footer from "../components/Footer";
import Loading from '../components/Loading'

export default function Dashboard() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            navigate("/");
        }

    }, [])

    const [produtos, Setprodutos] = useState([]);
    const [vendas, SetVendas] = useState([]);
    const [categorias, SetCategorias] = useState([]);
    const [maisvendidos, SetMaisvendidos] = useState([]);
    const [lojaMetaDados, setLojaMetaDados] = useState();
    const [espirou, setEspirou] = useState(false);
    const [isLoading, setIsloading] = useState(true);


    const pagamentoURL = "https://landing-page-stock-ligeiro.vercel.app";

    const dataISO = lojaMetaDados?.data_cadastro;
    const data = new Date(dataISO);
    const data1 = new Date();
    const dia = data?.getDate();
    const diaHoje = data1.getDate();


    const verificaPlano = () => {
        if ( dia + 3 - diaHoje > -1) {

            setEspirou(true);
            console.log("plano inspirado");
        } else {
            setEspirou(false);
            console.log(`plano ainda tem`);
        }
    };

    function parseJwt() {

        const token = sessionStorage.getItem('token');

        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Token inválido", e);
            return null;
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const dados = parseJwt(token);
        verificaPlano();
        setLojaMetaDados(dados);



    }, []);

    useEffect(() => {

        const token = sessionStorage.getItem('token')
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const fetchStats = async () => {
            try {
                const produtos = await api.get("/produtos", { headers });
                Setprodutos(produtos.data)
                console.log('produtos.data', produtos?.data)
            } catch (err) {
                console.error("Erro ao buscar estatísticas", err);
            }
        };

        fetchStats();




        const fetchVendas = async () => {
            try {
                const vendas = await api.get("/vendas/", { headers });


                SetVendas(vendas.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVendas();


        const fetchMaisVendidos = async () => {
            try {
                const Maisvendidos = await api.get("/vendas", { headers });
                SetMaisvendidos(Maisvendidos.data);
                // console.log('Maisvendidos.data',Maisvendidos.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchMaisVendidos();

        const fetchCategoria = async () => {
            try {
                const categorias = await api.get("/categorias", { headers });
                SetCategorias(categorias.data)

                console.log('categorias.data', categorias?.data)
            } catch (error) {
                console.error(error);
            } finally {
                setIsloading(false);
            }
        };

        fetchCategoria();


    }, []);

    const totalStock = produtos?.length > 0 ? produtos.reduce((soma, produto) => soma + produto.stock, 0) : 0;
    const totalVendas = vendas?.length > 0 ? vendas.reduce((soma, produto) => soma + produto.quantidade, 0) : 0;
    const totalFaturamento = vendas?.length > 0 ? vendas.reduce((soma, produto) => soma + produto.total, 0) : 0;

    console.log(' totalStock', totalStock)
    console.log(' totalVendas', totalVendas)
    console.log('totalFaturamento', totalFaturamento)
    console.log('categorias', categorias)


    const produtosComLucro = produtos?.length > 0 ? produtos.map((produto) => ({
        ...produto,
        lucro: produto.preco_venda - produto.preco_compra,
    })) : 0;

    const vendidos = (id) => {
        if (vendas.length > 0) {
            const item = vendas?.length > 0 ? vendas.find((v) => v.produto_id === id) : 0;;
            return item ? Number(item.quantidade) : 0
        }
        return 0;
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center overflow-y-scroll bg-[#003366]">


            
                {isLoading ?  <Loading message="Carregando O Painel...."/> : ""}
                
                
                


                    <div className="mt-10 bg-gray-100 rounded-lg p-8 w-full max-w-7xl text-white flex flex-col gap-8">
                        <img src="logo.png" alt="Logo" className="w-48 h-48 object-contain flex rounded-full mr-auto ml-auto" />
                        <h2 className="text-[#003366] text-center mb-8 text-4xl font-semibold">
                            {lojaMetaDados?.loja_nome} {lojaMetaDados?.status_pagamento == false? `| mais ${dia + 3 - diaHoje} dia de uso|` :"|"} 
                            {(lojaMetaDados?.status_pagamento == true && !espirou)
                                ? <span className="text-green-500">Plano Pago</span>
                                : <span className="text-red-600"> Plano ainda nao pago</span>}
                        </h2>
                        {(lojaMetaDados?.status_pagamento == false && espirou) && (
                            <a
                                href={pagamentoURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#003366] underline mb-8 block text-center"
                            >
                                Quero pagar agora
                            </a>
                        )}

                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="card bg-green-900 flex flex-col justify-center items-center p-8 rounded-xl w-60 h-60 text-center shadow-lg transition-transform transform hover:scale-105">
                                <Package size={42} />
                                <span className="text-4xl block sm:text-md box-border mt-2">{produtos?.length}</span>
                                <p className="text-4xl font-bold mt-2">Produtos</p>
                            </div>
                            <div className="card bg-yellow-500 flex flex-col  justify-center items-center p-8 rounded-xl w-60 h-60 text-center shadow-lg transition-transform transform hover:scale-105">
                                <DollarSign size={42} />
                                <span className="text-4xl block sm:text-md box-border  mt-2">{totalVendas}</span>
                                <p className="text-4xl font-bold mt-2">Vendas</p>
                            </div>
                            <div className="card bg-orange-500 flex flex-col justify-center items-center p-8 rounded-xl w-60 h-60 text-center shadow-lg transition-transform transform hover:scale-105">
                                <Layers3 size={42} />
                                <span className="text-4xl sm:text-md box-border  block mt-2">{totalStock}</span>
                                <p className="text-4xl font-bold mt-2">Stock</p>
                            </div>
                            <div className="card bg-purple-700 flex flex-col justify-center items-center p-8 rounded-xl w-60 h-60 text-center shadow-lg transition-transform transform hover:scale-105">
                                <Tags size={42} />
                                <span className="text-4xl block sm:text-md box-border  mt-2">{categorias?.length}</span>
                                <p className="text-4xl font-bold mt-2">Categorias</p>
                            </div>
                            <div className="card bg-red-500 flex flex-col border-0 justify-center items-center p-8 rounded-xl w-60 h-60 text-center shadow-lg transition-transform transform hover:scale-105">
                                <FaMoneyBillWave size={42} />
                                <span className="text-2xl block max-sm:2xl  box-border mt-2">{totalFaturamento}MT</span>
                                <p className="text-4xl font-bold mt-2">Faturamento</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xl">
                            {["tomato", "blue", "red", "gold","purpure"].map((color) => (
                                <button
                                    key={color}
                                    className="btn bg-[#003366] text-white rounded px-4 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        if (lojaMetaDados?.status_pagamento == true) {
                                            console.log('posdes acessar as rotas')
                                            const routes = {
                                                tomato: "/categoria",
                                                blue: "/add-produto",
                                                red: "/add-venda",
                                                gold: "/produtos",
                                                purpure: "/vendas"
                                            };

                                            if (espirou) {
                                                const routes = {
                                                tomato: "/categoria",
                                                blue: "/add-produto",
                                                red: "/add-venda",
                                                gold: "/produtos",
                                                purpure: "/vendas"
                                            };

                                            navigate(routes[color]);
                                            }
                                            navigate(routes[color]);
                                        } else {

                                            if (!espirou) {

                                                const routes = {
                                                tomato: "/categoria",
                                                blue: "/add-produto",
                                                red: "/add-venda",
                                                gold: "/produtos",
                                                purpure: "/vendas"
                                            };

                                            navigate(routes[color]);
                                                
                                            } else {
                                                
                                                window.location.href = pagamentoURL;
                                            }
                                        }
                                    }}
                                >
                                    {color === "tomato" && <>+ Gerenciar Categorias</>}
                                    {color === "blue" && <>+ Adicionar Produto</>}
                                    {color === "red" && <> Vender </>}
                                    {color === "gold" && <>+ Reabastecer o Stock</>}
                                    {color === "purpure" && <> Gerenciar Vendas</>}
                                </button>
                            ))}
                        </div>

                        <div className="top-produtos bg-gray-100 p-4 rounded-lg text-[#003366] mt-8 overflow-x-auto">
                            <h3 className="text-2xl mb-4 text-center font-semibold">
                                Produtos Mais Vendidos & Estoque Atual
                            </h3>
                            <table className="w-full border-collapse border border-[#003366]">
                                <thead>
                                    <tr>
                                        <th className="border border-[#003366] p-3 text-left">Produto</th>
                                        <th className="border border-[#003366] p-3 text-left">Categoria</th>
                                        <th className="border border-[#003366] p-3 text-left">Lucro</th>
                                        <th className="border border-[#003366] p-3 text-left">Estoque Atual</th>
                                        <th className="border border-[#003366] p-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendas?.length > 0 &&
                                        produtosComLucro.map((produto, index) => (
                                            <tr key={index}>
                                                <td className="border border-[#003366] p-3">{produto.nome}</td>
                                                <td className="border border-[#003366] p-3">{produto.categoria_nome}</td>
                                                <td className="border border-[#003366] p-3">
                                                    {(produto.lucro * vendidos(produto.id)).toFixed(2)}
                                                </td>
                                                <td className="border border-[#003366] p-3">{produto.stock}</td>
                                                <td className="border border-[#003366] p-3">
                                                    {produto.stock < 5 ? (
                                                        <span className="text-red-600 font-bold">Baixo</span>
                                                    ) : (
                                                        <span className="text-green-600 font-bold">Ok</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <Footer />
                    </div>
                
            
        </div>
    );
}
