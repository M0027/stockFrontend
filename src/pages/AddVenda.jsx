import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    FiDollarSign,
    FiShoppingCart,
    FiCalendar,
    FiSave,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import api from '../services/api';
import { p } from "framer-motion/client";
import Loading from'../components/Loading';

export default function AddVenda() {

    const[message, setMensagem] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        const token = sessionStorage.getItem('token');

        if (!token) navigate('/');
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm({ mode: "onChange" });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [produtoOptions, setProdutoOptions] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const fetchProdutos = async () => {

        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            setLoadingProducts(true);
            const response = await api.get("/produtos", { headers });
            setProdutoOptions(response.data);
        } catch (error) {
            toast.error(
                <div className="flex items-center gap-2 text-sm">
                    <FiAlertCircle className="text-red-500" />
                    Erro ao carregar produtos
                </div>
            );
        } finally {
            setLoadingProducts(false);
        }
    };

    const onSubmit = async (data, e) => {
       
        e.preventDefault();
        setIsSubmitting(true);

        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const response = await api.post("/vendas/", data, { headers });

            toast.success(
                <div className="flex items-center gap-2 text-sm">
                    <FiCheckCircle className="text-green-500" />
                    Venda registrada com sucesso! ID: {response.data.id}
                </div>,
                { autoClose: 4000 }
            );

            setMensagem('Venda registrada com sucesso!')

            reset();
        } catch (error) {
            let errorMessage = "Erro ao registrar venda";
             setMensagem('Erro ao registrar venda')
            console.error(error)

            if (error.response) {
                if (error.response.status === 400) {
                    setMensagem('Dados inválidos. Produto sem estoque suficiente.')
                    errorMessage = "Dados inválidos. Produto sem estoque suficiente.";
                } else if (error.response.status === 409) {
                    errorMessage = "Produto sem estoque suficiente.";
                    setMensagem('Produto sem estoque suficiente.')
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                    setMensagem(error.response.data.message)
                }
            }

            toast.error(
                <div className="flex items-center gap-2 text-sm">
                    <FiAlertCircle className="text-red-500" />
                    {errorMessage}
                </div>,
                { autoClose: 5000 }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateQuantity = (value) => parseInt(value) > 0 || "Quantidade deve ser maior que zero";
    const validateDate = (value) => value <= new Date().toISOString().split("T")[0] || "Data não pode ser futura";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white p-6">

            {isSubmitting? <Loading message="Adicionando a venda ..."/>:""}
            <h2 className="text-3xl mb-6 flex items-center gap-2">
                <FiShoppingCart />
                Registrar Venda
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-[#333] p-6 rounded-lg max-w-md w-full flex flex-col gap-4"
            >
                {/* Produto */}
                <div>
                    <label className=" mb-1 flex items-center gap-2">
                        <FiShoppingCart />
                        Produto
                    </label>
                    <select
                        {...register("produto_id", { required: "Selecione um produto" })}
                        onFocus={fetchProdutos}
                        className={`w-full p-2 rounded bg-white text-black ${errors.produto_id ? "border-2 border-red-500" : ""
                            }`}
                    >
                        <option value="">Selecione um produto</option>
                        {loadingProducts ? (
                            <option>Carregando produtos...</option>
                        ) : (
                            produtoOptions.map((produto) => (
                                <option key={produto.id} value={produto.id}>
                                    {produto.nome} (Estoque: {produto.stock})
                                </option>
                            ))
                        )}
                    </select>
                    {errors.produto_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.produto_id.message}</p>
                    )}
                </div>

                {/* Quantidade */}
                <div>
                    <label className=" mb-1 flex items-center gap-2">
                        <FiDollarSign />
                        Quantidade
                    </label>
                    <input
                        type="number"
                        min="1"
                        {...register("quantidade", {
                            required: "Quantidade é obrigatória",
                            validate: validateQuantity,
                        })}
                        className={`w-full p-2 rounded bg-white text-black ${errors.quantidade ? "border-2 border-red-500" : ""
                            }`}
                    />
                    {errors.quantidade && (
                        <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>
                    )}
                </div>

                {/* Preço Unitário */}
                <div>
                    <label className="mb-1 flex items-center gap-2">
                        <FiDollarSign />
                        Preço Unitário (MZN)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("preco_unitario", {
                            required: "Preço é obrigatório",
                            min: {
                                value: 0.01,
                                message: "Preço deve ser maior que zero",
                            },
                        })}
                        className={`w-full p-2 rounded bg-white text-black ${errors.preco_unitario ? "border-2 border-red-500" : ""
                            }`}
                    />
                    {errors.preco_unitario && (
                        <p className="text-red-500 text-sm mt-1">{errors.preco_unitario.message}</p>
                    )}
                </div>

                {/* Data da Venda */}
                <div>
                    <label className=" mb-1 flex items-center gap-2">
                        <FiCalendar />
                        Data da Venda
                    </label>
                    <input
                        type="date"
                        {...register("data_venda", {
                            required: "Data é obrigatória",
                            validate: validateDate,
                        })}
                        max={new Date().toISOString().split("T")[0]}
                        className={`w-full p-2 rounded bg-white text-black ${errors.data_venda ? "border-2 border-red-500" : ""
                            }`}
                    />
                    {errors.data_venda && (
                        <p className="text-red-500 text-sm mt-1">{errors.data_venda.message}</p>
                    )}
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 mt-4 flex items-center justify-center gap-2 rounded font-bold transition ${isSubmitting
                        ? "bg-red-600 opacity-70 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {isSubmitting ? "Registrando..." : (
                        <>
                            <FiSave />
                            Registrar Venda
                        </>
                    )}
                </button>
            </form>

            {message && (<p>{message}</p>)}

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}
