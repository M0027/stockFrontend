import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FiSave, FiAlertCircle, FiCheckCircle, FiDollarSign, FiPackage } from "react-icons/fi";
import CategoriaSelect from '../components/CategoriaSelect';
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Loading from '../components/Loading'

export default function AddProduto() {
 const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    navigate('/');
  }

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({ mode: 'onChange' });
  const [categoriaId, setCategoriaId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoriaSelect = (id) => {
    setCategoriaId(id);
  };

  const validateSellPrice = (value) => {
    const buyPrice = parseFloat(watch('preco_compra'));
    return parseFloat(value) >= buyPrice || "Preço de venda deve ser maior ou igual ao de compra";
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (!categoriaId) {
      toast.error('Selecione uma categoria', { icon: <FiAlertCircle /> });
      return;
    }

    setIsSubmitting(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const payload = { ...data, categoria_id: categoriaId };
      await api.post("/produtos/", payload, { headers });

      toast.success(
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-green-600" />
          Produto cadastrado com sucesso!
        </div>,
        { autoClose: 3000 }
      );

      reset();
      setCategoriaId('');
    } catch (error) {
      let errorMessage = "Erro ao salvar produto";
      if (error.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique as informações.";
      } else if (error.response?.status === 409) {
        errorMessage = "Produto já existe no sistema.";
      }

      toast.error(
        <div className="flex items-center gap-2">
          <FiAlertCircle className="text-red-600" />
          {errorMessage}
        </div>,
        { autoClose: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col justify-center items-center p-6 text-white">
    

      <h2 className="text-3xl mb-6 flex items-center gap-2">
        <FiPackage />
        Adicionar Produto
      </h2>

    { isSubmitting? <Loading message="A adicionar..."/>:""}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#333] rounded-lg p-6 w-full max-w-md flex flex-col gap-4"
      >
        {/* Nome do produto */}
        <div>
          <label className="block mb-1">Nome do Produto</label>
          <input
            {...register("nome", {
              required: 'Nome é obrigatório',
              minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
            })}
            className={`w-full p-2 rounded bg-white text-black ${errors.nome ? 'border-2 border-red-500' : ''}`}
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        {/* Categoria */}
        <div>
          <label className="block mb-1">Categoria</label>
          <CategoriaSelect onSelect={handleCategoriaSelect} />
          {!categoriaId && <p className="text-red-500 text-sm mt-1">Selecione uma categoria</p>}
        </div>

        {/* Quantidade em estoque */}
        <div>
          <label className="mb-1 flex items-center gap-1">
            <FiDollarSign />
            Quantidade em Estoque
          </label>
          <input
            type="number"
            {...register("stock", {
              required: 'Estoque é obrigatório',
              min: { value: 0, message: 'Estoque não pode ser negativo' }
            })}
            min="0"
            className={`w-full p-2 rounded bg-white text-black ${errors.stock ? 'border-2 border-red-500' : ''}`}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>

        {/* Preço de compra */}
        <div>
          <label className=" mb-1 flex items-center gap-1">
            <FiDollarSign />
            Preço de compra (MZN)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("preco_compra", {
              required: 'Preço de compra é obrigatório',
              min: { value: 0.01, message: 'Preço deve ser maior que zero' }
            })}
            className={`w-full p-2 rounded bg-white text-black ${errors.preco_compra ? 'border-2 border-red-500' : ''}`}
          />
          {errors.preco_compra && <p className="text-red-500 text-sm mt-1">{errors.preco_compra.message}</p>}
        </div>

        {/* Preço de revenda */}
        <div>
          <label className="mb-1 flex items-center gap-1">
            <FiDollarSign />
            Preço de revenda (MZN)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("preco_venda", {
              required: 'Preço de venda é obrigatório',
              validate: validateSellPrice
            })}
            className={`w-full p-2 rounded bg-white text-black ${errors.preco_venda ? 'border-2 border-red-500' : ''}`}
          />
          {errors.preco_venda && <p className="text-red-500 text-sm mt-1">{errors.preco_venda.message}</p>}
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 flex justify-center items-center gap-2 font-bold py-3 px-4 rounded transition ${
            isSubmitting ? 'bg-blue-500 opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Salvando...' : (
            <>
              <FiSave />
              Salvar Produto
            </>
          )}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
