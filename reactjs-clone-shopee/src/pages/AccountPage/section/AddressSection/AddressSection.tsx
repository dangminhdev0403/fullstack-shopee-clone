"use client";

import AddressForm from "@components/Form/AddressForm/AddressForm";
import { LoadingSkeleton } from "@components/Loading";
import { useAlert } from "@hooks/useAlert";
import { Button, CircularProgress, DialogActions } from "@mui/material";
import {
  AddressDTO,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@redux/api/addressApi";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AddressSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"add" | "edit">("add");
  const [newAddress, setNewAddress] = useState<AddressDTO>({
    id: 0,
    name: "",
    phone: "",
    addressDetail: "",
    provinceId: 0,
    districtId: 0,
    wardId: "0",
    fullAddress: "",
    isDefault: false,
    type: "home",
  });
  const { data, isLoading } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [editAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [createAddress, { isLoading: isCreatingAddress }] =
    useCreateAddressMutation();
  const addresses: AddressDTO[] = useMemo(() => data ?? [], [data]);
  const { confirm, error: errorAlert } = useAlert();

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

  const handleSaveAddress = async () => {
    console.log("handleSaveAddress", newAddress);

    if (action === "add") {
      try {
        await createAddress(newAddress).unwrap();
        toast.success("Thêm địa chỉ thành công");
        setIsOpen(false);
      } catch (err) {
        errorAlert(
          typeof err === "object" && err !== null && "data" in err && typeof (err as any).data?.message === "string"
            ? (err as any).data.message
            : "Thêm địa chỉ thất bại"
        );
        console.error(err);
      }
    } else if (action === "edit") {
      try {
        await editAddress(newAddress).unwrap();
        toast.success("Cập nhật địa chỉ thành công");
        setIsOpen(false);
      } catch (err) {
        errorAlert("Cập nhật địa chỉ thất bại");
        console.error(err);
      }
    }
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
          <button
            className="flex items-center space-x-2 rounded-md bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
            onClick={() => {
              setAction("add");
              setIsOpen(true);
              setNewAddress({
                id: 0,
                name: "",
                phone: "",
                addressDetail: "",
                provinceId: 0,
                districtId: 0,
                wardId: "0",
                fullAddress: "",
                isDefault: false,
                type: "home",
              });
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>
      </div>

      {!isOpen && (
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
                    onClick={() => {
                      setAction("edit");
                      setNewAddress(address);
                      setIsOpen(true);
                    }}
                    className="p-2 text-orange-500 hover:text-orange-600"
                    title="Sửa"
                  >
                    <Edit className="h-6 w-6" />
                  </button>
                  <button
                    title="Xóa"
                    onClick={() =>
                      address.id !== undefined && handleDelete(address.id)
                    }
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-6 w-6" />
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
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && (
        <AddressForm
          action={action}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          isLoading={false}
        />
      )}
      <DialogActions
        sx={{
          padding: "24px 32px",
          backgroundColor: "#fafafa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {isOpen && (
          <>
            <Button
              onClick={() => setIsOpen(false)}
              disabled={isCreatingAddress || isUpdatingAddress}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                color: "#666",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Trở lại
            </Button>
            <Button
              onClick={handleSaveAddress}
              variant="contained"
              disabled={isCreatingAddress || isUpdatingAddress}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                boxShadow: "0 4px 15px rgba(255, 107, 53, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #f7931e 0%, #ff6b35 100%)",
                  boxShadow: "0 6px 20px rgba(255, 107, 53, 0.4)",
                },
                "&:disabled": {
                  background: "#ccc",
                  boxShadow: "none",
                },
              }}
            >
              {isCreatingAddress || isUpdatingAddress ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={16} color="inherit" />
                  <span>
                    {action === "add" ? "Đang lưu..." : "Đang cập nhật..."}
                  </span>
                </div>
              ) : action === "add" ? (
                "Lưu địa chỉ"
              ) : (
                "Cập nhật địa chỉ"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </div>
  );
}
