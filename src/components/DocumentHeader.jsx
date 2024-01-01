import IMAGES from "../assets/images/Images";
import { companyAddress } from "../constants/company";

export default function DocumentHeader({ heading }) {
  return (
    <div className={`mb-20 flex items-center flex-col`}>
      <img className='w-24' src={IMAGES.logo} alt='logo' />

      <h1 className='font-black text-3xl uppercase text-center'>{heading} </h1>
      <div className=''>{companyAddress}</div>
    </div>
  );
}
