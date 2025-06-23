import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api';



export default function CategoriaSelect({ onSelect }) {
   
   const token = sessionStorage.getItem('token');
  const [categorias, setCategorias] = useState([]);
  const [selecionada, setSelecionada] = useState('');

  useEffect(() => {

    const headers= {
      'Authorization':`Barear ${token}`
    }
     
    try {
      const res = api.get('/categorias', {headers})
      setCategorias(res.data)
      res.then(res => setCategorias(res.data))
      
    } catch (error) {
      console.error(error)
    }
  }, []);

  const handleChange = (e) => {
    const id = e.target.value;
    setSelecionada(id);
    onSelect(id); // devolve o ID ao pai
  };

  return (
    <div className="categoria-select">
      <select className='bg-blue-400' value={selecionada} onChange={handleChange} required>
        <option value="">Selecione uma categoria</option>
        {categorias?.map(cat => (
          <option className='' key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
