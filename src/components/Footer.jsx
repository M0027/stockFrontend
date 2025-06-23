import { FaFacebookF, FaWhatsapp, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white py-6 mt-10">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm md:text-base">
          &copy; {anoAtual} - 2030. Todos os direitos reservados.{" "}
          <span className="text-teal-400 font-semibold">StockLigeiro</span>
        </p>

        <div className="flex justify-center gap-6 mt-4 text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-transform transform hover:scale-110"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://wa.me/258863727760"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-transform transform hover:scale-110"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-transform transform hover:scale-110"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
