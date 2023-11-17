import { useAuth } from "../contexts/authContext";
import ButtonWidePrimary from "./buttons/ButtonWidePrimary";

export default function Logout() {
  const { logout } = useAuth();

  return (
    <ButtonWidePrimary
      onClick={logout}
      icon={
        <svg
          className='w-5 h-5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 16 16'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3'
          />
        </svg>
      }
    >
      Log Out
    </ButtonWidePrimary>
  );
}
