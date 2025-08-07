import { Button } from "@mui/material";
import { ROUTES } from "@utils/constants/route";
import React from "react";
import { useNavigate } from "react-router";

type HasId = { id: string | number };

interface DropdownMenuProps<T extends HasId> {
  label?: string;
  items: T[];
  icon?: React.ReactNode;
  isCard?: boolean;
  renderItem: (item: T) => React.ReactNode;
  popsition?: string;
}

export default function DropdownMenu<T extends HasId>({
  label,
  items,
  icon,
  isCard,
  renderItem,
  popsition,
}: Readonly<DropdownMenuProps<T>>) {
  const navigate = useNavigate();
  return (
    <div className="group relative inline-block text-white">
      {/* Nút dropdown */}
      <div className="relative flex cursor-pointer items-center gap-1 bg-transparent px-2">
        {icon && <span>{icon}</span>}
        {label && (
          <div
            className={`${isCard ? "absolute top-[0] right-[0] z-20 rounded-full bg-amber-50 px-1 align-text-top text-sm text-amber-600" : "text-base"}`}
          >
            {label}
          </div>
        )}
      </div>

      {/* Menu dropdown */}
      <div
        className={`invisible absolute top-full left-[-3rem] z-50 mt-3 min-w-36 scale-95 rounded-md bg-white text-black opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100 ${popsition}`}
      >
        <div className="absolute top-[-8px] right-4 h-0 border-r-8 border-b-8 border-l-8 border-r-transparent border-b-white border-l-transparent" />
        {isCard && (
          <p className="ml-2 p-2 text-sm text-gray-400">Sản phẩm mới thêm</p>
        )}
        {items.slice(0, 5).map((item) => (
          <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
        ))}
        {isCard && (
          <div className="flex items-center justify-between p-2">
            <div>
              {items.length > 5 ? (
                <span className="text-sm text-gray-700">
                  +{items.length - 5} sản phẩm khác
                </span>
              ) : (
                <span className="text-sm text-gray-500">Không có sản phẩm</span>
              )}
            </div>
            <Button
              variant="contained"
              className="!bg-[#ee4d2d]"
              onClick={() => {
                navigate(ROUTES.CART);
              }}
            >
              Xem giỏ hàng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
