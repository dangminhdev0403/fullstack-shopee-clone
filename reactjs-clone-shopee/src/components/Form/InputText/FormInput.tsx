import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

const FormInput = ({ ...props }: FormInputProps) => {
  return (
    <div className={props.className ?? "mt-2"}>
      <input
        type="text"
        placeholder={props.placeholder}
        className="h-10 w-full rounded border border-gray-400"
        {...props.register}
      />

      <div className="min-h-[1.5rem] text-red-400">{props.error?.message} </div>
    </div>
  );
};

export default FormInput;
