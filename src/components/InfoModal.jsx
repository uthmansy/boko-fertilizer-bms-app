import ButtonPrimary from "./buttons/ButtonPrimary";

export default function InfoModal({ children, close }) {
  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-40 flex items-center justify-center'>
      <div className='bg-white p-5 w-full max-w-sm m-5'>
        <ButtonPrimary onClick={close}>close</ButtonPrimary>
        {children}
      </div>
    </div>
  );
}
