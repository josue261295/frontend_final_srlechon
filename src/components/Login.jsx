import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import ErrorMessage from './errorMessage';
import { isAxiosError } from 'axios';
import Cookies from 'js-cookie';


export default function Login() {
  const[message, setMessage] = useState('');
  const navigate = useNavigate(); 


const {register, handleSubmit, formState: { errors }} = useForm();

const handleLogin = async (formData) => {
  try {
    const {data} = await api.post('/api/auth/login', formData);
    const token =data.token;

    if (!token) return setMessage('No se recibió token de autenticación');

    Cookies.set("AUTH_TOKEN", token, {
      expires: 1,
      secure:false,
      sameSite: 'strict',

    })

    navigate('/admin/resumen');
  } catch (error) {
    if (isAxiosError(error) && error.response){
      setMessage(error.response.data.message);

      setMessage(error.response.data.error);




    }
  }

}


  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-orange-100">
        
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            🐷
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Sr. Lechón
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa al sistema administrativo
          </p>
        </div>



{message.length > 0 &&  <ErrorMessage>{message}</ErrorMessage>}



        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="admin@srlechon.com"
               {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "E-mail no válido",
                  },
                })}
              />

                {errors.email && (
                  < ErrorMessage>{errors.email.message}</ErrorMessage>
                )}

            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="••••••••"

                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}


              />
              {errors.password && (
                  < ErrorMessage>{errors.password.message}</ErrorMessage>
                )}


            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Ingresar al Sistema
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400 mt-4">
          © 2026 Sr. Lechón - Sistema de Gestión
        </div>
      </div>
    </div>
  );
}