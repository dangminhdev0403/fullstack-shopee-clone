import { ClipLoader } from "react-spinners";

interface ButtonProps {
  title: string;
  isSubmitting: boolean;
}
const Button = ({ title, isSubmitting }: ButtonProps) => {
  return (
    <button
      className="curshadow mt-7 flex w-full cursor-pointer items-center justify-center rounded bg-[#EE4D2D] p-2 hover:bg-orange-500 disabled:cursor-not-allowed"
      disabled={isSubmitting}
    >
      {isSubmitting && <ClipLoader size={25} color="#fff" />}

      {!isSubmitting && title}
    </button>
  );
};

export default Button;
