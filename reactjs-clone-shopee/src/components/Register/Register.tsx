import { Button } from "@components/Form/Button";
import FormInput from "@components/Form/InputText/FormInput";
import { useSignUpMutation } from "@redux/api/authApi";
import { authSlice } from "@redux/slices/authSlice";
import { ROUTES } from "@utils/constants/route";
import { UserRegister } from "@utils/constants/types/auth";
import ErrorResponse from "@utils/constants/types/errors.response";
import { rules } from "@utils/rules";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const Register = () => {
  const {
    register,
    handleSubmit,

    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sinUp, { data, isError, error, isSuccess }] = useSignUpMutation();

  const onSubmit = handleSubmit(async (data) => {
    const dataRegister: UserRegister = {
      ...data,
    };
    sinUp(dataRegister);
  });

  useEffect(() => {
    if (isError) {
      const err = error as ErrorResponse;

      toast.error(err?.data.message);
    }

    if (isSuccess) {
      toast.success("Đăng ký thành công");
      dispatch(authSlice.actions.setLogin(data?.data));
      navigate(ROUTES.HOME);
    }
  }, [data, isError, error, isSuccess, navigate, dispatch]);
  return (
    <div className="ml-auto bg-white p-8 lg:mr-40 lg:w-[400px]">
      <div className="hidden lg:block lg:text-2xl">Đăng Ký</div>
      <form onSubmit={onSubmit}>
        <FormInput
          className="mt-6"
          type="text"
          placeholder="Tên"
          register={register("name", rules.required("tên"))}
          error={errors.name}
        />

        <FormInput
          type="text"
          placeholder="Email"
          register={register("email", {
            ...rules.required("email"),
            ...rules.mustEmail(),
          })}
          error={errors.email}
        />

        <FormInput
          type="password"
          placeholder="Mật khẩu"
          register={register("password", {
            ...rules.required("mật khẩu"),
          })}
          error={errors.password}
        />

        <FormInput
          type="password"
          placeholder="Xác nhận mật khẩu"
          error={errors.confirmPassword}
          register={register("confirmPassword", {
            ...rules.required("xác nhận khẩu"),

            validate: (value) => {
              const password = getValues("password");
              if (password !== value) {
                return "Mật khẩu không khớp";
              }
            },
          })}
        />

        <div>
          <Button title="Đăng Ký" isSubmitting={isSubmitting} />
        </div>
        <div className="divider mt-3.5">
          <span>HOẶC</span>
        </div>
      </form>

      <div className="gap-3 lg:flex">
        <button className="mt-7 flex w-full cursor-pointer justify-center rounded border p-1">
          <svg
            className="mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
          >
            <path
              fill="#74C0FC"
              d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
            />
          </svg>
          <span> Facebook</span>
        </button>
        <button className="mt-7 flex w-full cursor-pointer justify-center rounded border p-1">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="google"
            width={22}
            height={22}
            className="mr-2"
          />
          <span>Google</span>
        </button>
      </div>
      <div className="mt-2 text-sm lg:mt-5 lg:text-center">
        Bạn đã có tài khoản ?{" "}
        <Link to={"/login"} className="cursor-pointer text-[#EE4D2D]">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default Register;
