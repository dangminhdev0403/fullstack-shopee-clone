import { useDistricts, useProvinces, useWards } from "@hooks/useLocation";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AddressDTO } from "@redux/api/addressApi";
import { ApiResponse, Ward } from "@service/location.service";
import { motion } from "framer-motion";

interface AddressFormProps {
  action: "add" | "edit";
  newAddress: AddressDTO;
  setNewAddress: React.Dispatch<React.SetStateAction<AddressDTO>>;
  isLoading: boolean;
}

export default function AddressForm({
  action,
  newAddress,
  setNewAddress,
  isLoading,
}: AddressFormProps) {
  const { data: provinces = [], isLoading: isLoadingProvinces } =
    useProvinces();

  const reversedProvinces = [
    ...(Array.isArray(provinces) ? provinces : (provinces?.data ?? [])),
  ].reverse();
  const { data: districts = [], isLoading: isLoadingDistricts } = useDistricts(
    newAddress.provinceId,
  );

  const { data: wards = [], isLoading: isLoadingWards } = useWards(
    newAddress.districtId,
  );

  const updateFullAddress = (partialAddress: AddressDTO) => {
    const provinceArr = Array.isArray(provinces)
      ? provinces
      : (provinces?.data ?? []);
    const districtArr = Array.isArray(districts)
      ? districts
      : (districts?.data ?? []);
    const wardArr = Array.isArray(wards) ? wards : (wards?.data ?? []);

    const province =
      provinceArr.find((p) => p.ProvinceID === partialAddress.provinceId)
        ?.ProvinceName || "";
    const district =
      districtArr.find((d) => d.DistrictID === partialAddress.districtId)
        ?.DistrictName || "";
    const ward =
      wardArr.find((w) => String(w.WardCode) === String(partialAddress.wardId))
        ?.WardName || "";

    return `${partialAddress.addressDetail}, ${ward}, ${district}, ${province}`;
  };

  const handleProvinceChange = (value: number) => {
    const updatedAddress = {
      ...newAddress,
      provinceId: value,
      districtId: 0,
      wardId: "0",
    };
    setNewAddress((prev: AddressDTO) => ({
      ...prev,
      provinceId: value,
      districtId: 0,
      wardId: "0",
      fullAddress: updateFullAddress(updatedAddress),
    }));
  };
  const handleDistrictChange = (value: number) => {
    const updatedAddress = {
      ...newAddress,
      districtId: value,
      wardId: "0",
    };

    setNewAddress({
      ...updatedAddress,
      fullAddress: updateFullAddress(updatedAddress),
    });
  };

  const handleWardChange = (value: string) => {
    const updatedAddress = {
      ...newAddress,
      wardId: value ? String(value) : "0",
    };

    setNewAddress({
      ...updatedAddress,
      fullAddress: updateFullAddress(updatedAddress),
    });
  };

  const getValidProvinceId = () => {
    if (isLoadingProvinces) return "";
    const validIds = reversedProvinces.map((p) => p.ProvinceID);
    return validIds.includes(newAddress.provinceId || 0)
      ? newAddress.provinceId
      : "";
  };

  const getValidDistrictId = () => {
    if (isLoadingDistricts) return "";
    const validIds = (
      Array.isArray(districts) ? districts : (districts?.data ?? [])
    ).map((d) => d.DistrictID);
    return validIds.includes(newAddress.districtId || 0)
      ? newAddress.districtId
      : "";
  };

  const getValidWardId = () => {
    if (isLoadingWards) return "";
    const wardData = Array.isArray((wards as any)?.data)
      ? (wards as ApiResponse<Ward>).data
      : Array.isArray(wards)
        ? wards
        : [];

    const validIds = wardData.map((w: Ward) => String(w.WardCode));
    return validIds.includes(String(newAddress.wardId || 0))
      ? newAddress.wardId
      : "";
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&:hover fieldset": { borderColor: "#ff6b35" },
      "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ff6b35",
    },
  };

  const selectSx = {
    borderRadius: "12px",
    "& .MuiOutlinedInput-notchedOutline": { borderRadius: "12px" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ff6b35" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ff6b35",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-6">
        <Typography variant="h6" className="mb-2 font-bold text-gray-800">
          {action === "add" ? "Thêm địa chỉ mới" : "Cập nhật địa chỉ"}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {action === "add"
            ? "Điền thông tin địa chỉ giao hàng mới của bạn"
            : "Cập nhật thông tin địa chỉ giao hàng của bạn"}
        </Typography>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="Họ tên người nhận"
            fullWidth
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
            variant="outlined"
            disabled={isLoading}
            sx={textFieldSx}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
            variant="outlined"
            disabled={isLoading}
            sx={textFieldSx}
          />
        </div>

        <TextField
          label="Địa chỉ cụ thể (số nhà, tên đường...)"
          fullWidth
          value={newAddress.addressDetail}
          onChange={(e) =>
            setNewAddress({ ...newAddress, addressDetail: e.target.value })
          }
          variant="outlined"
          disabled={isLoading}
          sx={textFieldSx}
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormControl fullWidth>
            <InputLabel
              id="province-label"
              sx={{ "&.Mui-focused": { color: "#ff6b35" } }}
            >
              Tỉnh/Thành phố
            </InputLabel>
            <Select
              labelId="province-label"
              value={getValidProvinceId()}
              label="Tỉnh/Thành phố"
              onChange={(e) => handleProvinceChange(e.target.value as number)}
              disabled={isLoading || isLoadingProvinces}
              sx={selectSx}
            >
              <MenuItem value={0} disabled>
                {isLoadingProvinces ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={16} />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  "Chọn tỉnh/thành"
                )}
              </MenuItem>
              {reversedProvinces.map((province) => (
                <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              id="district-label"
              sx={{ "&.Mui-focused": { color: "#ff6b35" } }}
            >
              Quận/Huyện
            </InputLabel>
            <Select
              labelId="district-label"
              value={getValidDistrictId()}
              label="Quận/Huyện"
              onChange={(e) => handleDistrictChange(e.target.value as number)}
              disabled={
                !newAddress.provinceId || isLoading || isLoadingDistricts
              }
              sx={selectSx}
            >
              <MenuItem value={0} disabled>
                {isLoadingDistricts ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={16} />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  "Chọn quận/huyện"
                )}
              </MenuItem>
              {(Array.isArray(districts)
                ? districts
                : Array.isArray(districts?.data)
                  ? districts.data
                  : []
              )
                .slice()
                .reverse()
                .map((district) => (
                  <MenuItem
                    key={district.DistrictID}
                    value={district.DistrictID}
                  >
                    {district.DistrictName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              id="ward-label"
              sx={{ "&.Mui-focused": { color: "#ff6b35" } }}
            >
              Phường/Xã
            </InputLabel>
            <Select
              labelId="ward-label"
              value={getValidWardId()}
              label="Phường/Xã"
              onChange={(e) => handleWardChange(e.target.value)}
              disabled={!newAddress.districtId || isLoading || isLoadingWards}
              sx={selectSx}
            >
              <MenuItem value={0} disabled>
                {isLoadingWards ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={16} />
                    <span>Đang tải...</span>
                  </div>
                ) : (
                  "Chọn phường/xã"
                )}
              </MenuItem>
              {(Array.isArray((wards as any)?.data)
                ? (wards as ApiResponse<Ward>).data
                : Array.isArray(wards)
                  ? wards
                  : []
              ).map((ward) => (
                <MenuItem key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </motion.div>
  );
}
