import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import Loading from '../components/Loading'
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Preencha todos os campos!");
            setLoading(false)
            return;
        }
        setLoading(true);


        try {
            const response = await fetch("http://localhost:5432/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha: password }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Falha no login");
            }

            const data = await response.json();
           

           sessionStorage.setItem('token', `${data.token}`);
            toast.success("Login bem-sucedido!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (error) {
            toast.error(error.message || "Erro inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#000]">

           { loading? <Loading message="A Verificar Credencias"/>: ""}
            <motion.div
                className="max-w-md w-full p-8 bg-zinc-800 text-center rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl text-white mb-6 font-bold">StockLigeiro</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <FaEnvelope className="text-gray-500 mr-2" />
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent outline-none flex-1 text-sm"
                        />
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-100">
                        <FaLock className="text-gray-500 mr-2" />
                        <input
                            type="password"
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent outline-none flex-1 text-sm"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white text-sm transition ${loading
                                ? " bg-cyan-400 cursor-not-allowed"
                                : " bg-cyan-400 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Entrando..." : "Login"}
                    </motion.button>
                </form>

                <p className="text-white mt-4 text-sm">
                    Ainda não tem conta?{"  "}
                    <Link to="/cadastro" className="text-blue-300 underline cursor-pointer">
                        Cadastrar-se
                    </Link>
                </p>

                <ToastContainer position="top-right" autoClose={3000} />
            </motion.div>
        </div>
    );
}
