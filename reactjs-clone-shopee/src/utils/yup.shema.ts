import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .required("Mật khẩu mới là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

// ✅ Tự động sinh type từ schema
export type ChangePasswordFormValues = yup.InferType<
  typeof changePasswordSchema
>;
