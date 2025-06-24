import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

import Loading from '../components/Loading'

export default function CadastroLoja() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const senha = watch("senha");
  const confirmar = watch("confirmar");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const removerTags = (str) => str.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags

  const onSubmit = async (dados , e) => {

    setLoading(true)
    
    e.preventDefault()

    if (senha !== confirmar) {
      setMensagem("As senhas não coincidem");
      setLoading(false)
      return;
    }

    const nome_loja = removerTags(dados.nome);
    const email = removerTags(dados.email);
    const senhaLimpa = removerTags(dados.senha);

    if (/('|--|;|--|\b(OR|AND)\b)/i.test(nome_loja + email + senhaLimpa)) {
      setLoading(false)
      return setMensagem("Entrada inválida detectada.");
    }

    try {
      const res = await api.post("/cadastro/loja", {
        nome_loja,
        email,
        senha: senhaLimpa,
      });

      navigate("/");

      setMensagem(res.data.msg || "Cadastro realizado com sucesso!");
      reset();
    } catch (err) {
      setMensagem(err.response?.data?.msg || "Erro ao cadastrar");
      console.error(err);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex justify-center items-start pt-16 px-4">
      <div className="max-w-md w-full bg-[#1c1c1c] rounded-xl shadow-md shadow-cyan-900 p-8">
        <h2 className="text-center text-cyan-400 text-2xl mb-6 font-semibold">
          Cadastrar Loja
        </h2>
      {loading? <Loading message="Cadastrando..."/>:''}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            placeholder="Nome da Loja"
            {...register("nome", { required: "Nome é obrigatório", maxLength: 100 })}
            className="w-full p-3 rounded-md bg-[#2c2c2c] text-white border-none outline-none"
          />
          {errors.nome && (
            <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
          )}

          <input
            type="email"
            placeholder="Email da Loja"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
            })}
            className="w-full p-3 rounded-md bg-[#2c2c2c] text-white border-none outline-none"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Senha"
            {...register("senha", {
              required: "Senha é obrigatória",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
            className="w-full p-3 rounded-md bg-[#2c2c2c] text-white border-none outline-none"
          />
          {errors.senha && (
            <p className="text-red-400 text-sm mt-1">{errors.senha.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirmar Senha"
            {...register("confirmar", { required: "Confirme a senha" })}
            className="w-full p-3 rounded-md bg-[#2c2c2c] text-white border-none outline-none"
          />
          {confirmar && senha !== confirmar && (
            <p className="text-red-400 text-sm mt-1">As senhas não coincidem</p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-500 transition-colors text-black font-bold rounded-md py-3 mt-3 cursor-pointer"
          >
            Cadastrar
          </button>
        </form>

        {mensagem && (
          <p className="text-red-400 text-center mt-4 text-sm">{mensagem}</p>
        )}

        <p className="text-center mt-6 text-sm">
          Já Tem uma conta?{" "}
          <Link to="/" className="text-blue-300 underline cursor-pointer">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
