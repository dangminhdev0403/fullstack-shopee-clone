"use client";

import { LoadingSkeleton } from "@components/Loading";
import { useAlert } from "@hooks/useAlert";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@redux/api/profileApi";
import { Save, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

interface ProfileFormValues {
  name: string;
  email: string;
  avatarUrl: string;
  avatarFile?: FileList;
}

export default function ProfileSection() {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { confirm } = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      avatarUrl: "",
    },
  });

  // khi có data từ API thì reset lại form
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      });
    }
  }, [data, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    console.log(values);
    console.log(fileInputRef.current?.files);

    confirm(
      "Xác nhận cập nhật hồ sơ",
      "Bạn có chắc chắn muốn lưu thay đổi?",
      async () => {
        try {
          await updateProfile({
            name: values.name,
            email: values.email,
            avatarFile: values.avatarFile ? values.avatarFile[0] : undefined,
          }).unwrap();
          setPreview(null);
          toast.success("Cập nhật hồ sơ thành công");
        } catch (error) {
          console.log(error);
          toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && e.target.files) {
      setPreview(URL.createObjectURL(file));
      setValue("avatarFile", e.target.files as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="animate-slide-in p-8">
      <div className="mb-8 border-b border-gray-500 pb-6">
        <h2 className="text-foreground text-2xl font-bold">Hồ sơ của tôi</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-12"
        encType="multipart/form-data"
      >
        {/* Form bên trái */}
        <div className="max-w-lg flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Họ & Tên</label>
            <input
              type="text"
              placeholder="Họ & Tên"
              {...register("name", { required: "Họ tên không được để trống" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email không được để trống",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Email không hợp lệ",
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 rounded-lg px-6 py-3 shadow-md transition-all"
          >
            <Save className="h-5 w-5" />
            {isLoading ? (
              <ClipLoader size={25} color="#fff" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Lưu thay đổi</span>
          </button>
        </div>

        {/* Avatar bên phải */}
        <div className="flex-shrink-0">
          <div className="rounded-xl border border-gray-500 p-8 text-center">
            <div className="relative mb-6 inline-block">
              {preview || data?.avatarUrl ? (
                <div className="h-32 w-32">
                  <img
                    src={preview || data?.avatarUrl}
                    alt="Avatar"
                    className="h-32 w-32 justify-center rounded-full bg-gradient-to-br object-cover shadow-xl"
                  />
                </div>
              ) : (
                <div className="from-primary to-secondary flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-xl">
                  <span className="text-4xl font-bold text-white">
                    {data?.name[0]}
                  </span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              {...register("avatarFile")}
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mx-auto flex items-center space-x-2 rounded-lg px-6 py-3 shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Chọn ảnh</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
