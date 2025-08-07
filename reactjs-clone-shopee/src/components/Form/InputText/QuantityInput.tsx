import { Box, IconButton, InputBase } from "@mui/material";
import { ChangeEvent } from "react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export default function QuantityInput({
  value,
  onChange,
  max,
}: QuantityInputProps) {
  const handleChange = (newValue: number) => {
    if (newValue < 1) return;
    if (max && newValue > max) return;
    onChange(newValue);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      handleChange(val);
    } else {
      onChange(1); // fallback khi xoá input
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      border={1}
      borderColor="grey.300"
      borderRadius={1}
      height={32}
    >
      <IconButton
        size="small"
        onClick={() => handleChange(value - 1)}
        sx={{
          borderRight: "1px solid #ccc",
          borderRadius: 0,
          width: 32,
          height: 32,
        }}
      >
        –
      </IconButton>

      <InputBase
        value={value}
        onChange={handleInputChange}
        inputProps={{
          style: {
            textAlign: "center",
            padding: 0,
            fontSize: 16,
            width: 80,
          },
        }}
      />

      <IconButton
        size="small"
        onClick={() => handleChange(value + 1)}
        sx={{
          borderLeft: "1px solid #ccc",
          borderRadius: 0,
          width: 32,
          height: 32,
        }}
      >
        +
      </IconButton>
    </Box>
  );
}
