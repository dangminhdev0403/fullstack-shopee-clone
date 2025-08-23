"use client";

import { LoadingSkeleton } from "@components/Loading";
import { useAlert } from "@hooks/useAlert";
import {
  AddressDTO,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@redux/api/addressApi";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "react-toastify";

export default function AddressSection() {
  const { data, isLoading } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [editAddress] = useUpdateAddressMutation();
  const addresses: AddressDTO[] = useMemo(() => data ?? [], [data]);
  const { confirm, success, error: errorAlert } = useAlert();

  const handleSetDefault = async (id: number) => {
    const addess = addresses.find((address) => address.id === id);
    if (addess) {
      try {
        await editAddress({ ...addess, isDefault: true }).unwrap();
        toast.success("Cập nhật địa chỉ thành công");
      } catch (err) {
        errorAlert("Cập nhật địa chỉ thất bại");
        console.error(err);
      }
    }
  };

  const handleDelete = (id: number) => {
    confirm(
      "Xác nhận xoá địa chỉ",
      "Bạn có chắc chắn muốn xoá địa chỉ này?",
      async () => {
        try {
          await deleteAddress(id).unwrap();
          toast.success("Xoá địa chỉ thành công");
        } catch (error) {
          errorAlert("Xoá địa chỉ thất bại", "Vui lòng thử lại sau.");
          console.error(" error:", error);
        }
      },
    );
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Địa chỉ của tôi
            </h2>
            <p className="mt-1 text-gray-600">Quản lý địa chỉ nhận hàng</p>
          </div>
          <button className="flex items-center space-x-2 rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">
                    {address.name}
                  </h3>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">{address.phone}</span>
                  {address.isDefault && (
                    <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{address.fullAddress}</span>
                </div>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                <button
                  className="p-1 text-orange-500 hover:text-orange-600"
                  title="Sửa"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  title="Xóa"
                  onClick={() =>
                    address.id !== undefined && handleDelete(address.id)
                  }
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-4 border-t border-gray-100 pt-3">
              {!address.isDefault && (
                <button
                  onClick={() =>
                    address.id !== undefined && handleSetDefault(address.id)
                  }
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Thiết lập mặc định
                </button>
              )}
              <button className="text-sm text-gray-500 hover:text-gray-600">
                Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
