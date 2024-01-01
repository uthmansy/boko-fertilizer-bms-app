import { useState } from "react";
import ErrorPop from "../components/ErrorPop";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import IMAGES from "../assets/images/Images";
import { companyFullName } from "../constants/company";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setisLoading(true);
    const loginStatus = await login({ email, password });
    loginStatus.success ? navigate("/") : setError(loginStatus.error);
    setisLoading(false);
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800'>
        <div className='px-6 py-4'>
          <div className='flex justify-center mx-auto'>
            <img className='w-20' src={IMAGES.logo} alt='logo' />
          </div>

          <h3 className='mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200'>
            {companyFullName} Portal
          </h3>

          <p className='mt-1 text-center text-gray-500 dark:text-gray-400'>
            Login
          </p>

          <form onSubmit={handleLogin}>
            <div className='w-full mt-4'>
              <input
                className='block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300'
                type='email'
                placeholder='Email Address'
                aria-label='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='w-full mt-4'>
              <input
                className='block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300'
                type='password'
                placeholder='Password'
                aria-label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className='flex items-center justify-end mt-4'>
              <button
                disabled={isLoading}
                type='submit'
                className='px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50'
              >
                {isLoading ? <Spinner /> : "Sign in"}
              </button>
            </div>
          </form>
          {error && <ErrorPop>{error}</ErrorPop>}
        </div>
      </div>
    </div>
  );
}
