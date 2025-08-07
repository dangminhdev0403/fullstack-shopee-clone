import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CartDetailDTO } from "@redux/api/cartApi";
import { Minus, Plus, Trash2 } from "lucide-react";
import { memo } from "react";

interface CartItemProps {
  item: CartDetailDTO;
  selected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onQuantityChange: (
    id: number,
    newQuantity: number,
    currentQuantity: number,
  ) => void;
  onRemove: (id: number) => void;
  formatPrice: (price: number) => string;
}

const CartItem = ({
  item,
  selected,
  onSelect,
  onQuantityChange,
  onRemove,
  formatPrice,
}: CartItemProps) => {
  return (
    <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Checkbox & Product Info */}
          <div className="flex flex-1 items-start gap-4">
            <Checkbox
              checked={selected}
              onChange={(e) => onSelect(item.id, e.target.checked)}
              sx={{ color: "orange.main", mt: 1 }}
            />

            <div className="relative">
              <img
                src={item.product.imageUrl ?? "/placeholder.svg"}
                alt={item.product.name}
                className="h-24 w-24 rounded-lg border object-cover shadow-sm md:h-28 md:w-28"
              />
            </div>

            <div className="min-w-0 flex-1">
              <Typography
                variant="h6"
                className="mb-2 line-clamp-2 font-medium text-gray-900"
              >
                {item.product.name}
              </Typography>
            </div>
          </div>

          {/* Price, Quantity, Actions */}
          <div className="flex items-center justify-between gap-4 md:gap-8">
            <div className="text-center font-semibold text-orange-600">
              {formatPrice(item.product.price)}
            </div>

            <div className="flex items-center">
              <IconButton
                size="small"
                onClick={() =>
                  onQuantityChange(
                    item.product.id,
                    item.quantity - 1,
                    item.quantity,
                  )
                }
                disabled={item.quantity <= 1}
                className="border border-gray-300"
              >
                <Minus className="h-4 w-4" />
              </IconButton>
              <TextField
                type="text"
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(
                    item.product.id,
                    Number.parseInt(e.target.value) || 1,
                    item.quantity,
                  )
                }
                className="mx-2 w-16"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    textAlign: "center",
                  },
                }}
              />
              <IconButton
                size="small"
                onClick={() =>
                  onQuantityChange(
                    item.product.id,
                    item.quantity + 1 || 1,
                    item.quantity,
                  )
                }
                disabled={item.quantity >= item.product.stock}
                className="border border-gray-300"
              >
                <Plus className="h-4 w-4" />
              </IconButton>
            </div>

            <div className="text-center font-bold text-orange-600">
              {formatPrice(item.quantity * item.product.price)}
            </div>

            <Tooltip title="Xóa sản phẩm">
              <IconButton
                onClick={() => onRemove(item.product.id)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(CartItem);
