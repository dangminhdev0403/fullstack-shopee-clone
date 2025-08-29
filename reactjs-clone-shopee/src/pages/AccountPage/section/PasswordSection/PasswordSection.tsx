import { yupResolver } from "@hookform/resolvers/yup";
import { useChangePasswordMutation } from "@redux/api/profileApi";
import { changePasswordSchema } from "@utils/yup.shema";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export default function PasswordSection() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema as any),
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword, // map sang backend DTO
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      // ✅ Nếu success
      reset();
      toast.success("Đổi mật khẩu thành công");
    } catch (error: any) {
      if (error?.data?.message) {
        // error.data.message là mảng [{ oldPassword: "Old password is required" }]
        setError("oldPassword", {
          type: "server",
          message: error.data.message,
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h2>
        <p className="mt-1 text-gray-600">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                placeholder="Nhập mật khẩu hiện tại"
                {...register("oldPassword")}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-medium mt-1 text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-medium mt-1 text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-medium mt-1 text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center space-x-2 rounded-md bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
          >
            {isLoading ? (
              <ClipLoader size={25} color="#fff" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            <span>Xác nhận</span>
          </button>
        </form>
      </div>
    </div>
  );
}
