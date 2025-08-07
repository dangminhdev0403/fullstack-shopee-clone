import { gennerateNameId } from "@utils/helper";
import { Link } from "react-router-dom";

interface ItemProductProps {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  rating?: number;
  sold?: number;
  location?: string;
  tag?: string;
}

const ItemProduct = ({
  id,
  name,
  imageUrl,
  price,
  rating = 4.8,
  sold = 1200,
  location = "TP.HCM",
  tag,
}: ItemProductProps) => {
  return (
    <Link to={`/product/${gennerateNameId({ name, id: id.toString() })}`}>
      <div className="group relative z-10 w-full rounded-sm border border-gray-200 bg-white transition hover:z-30 hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md">
        <div className="relative aspect-[1/1] w-full overflow-hidden">
          <img
            className="absolute top-0 left-0 z-0 h-[180px] w-full object-cover"
            src={imageUrl}
            alt={name}
          />
        </div>
        <div className="p-2 text-[1rem]">
          <h5 className="line-clamp-2 h-10 leading-5 text-gray-800">
            {tag && (
              <span className="mr-0.5 rounded-sm bg-[#ee4d2d] px-0.5 text-xs text-white">
                {tag}
              </span>
            )}
            {name}
          </h5>
          <p className="mt-1 text-[#ee4d2d]">
            {price.toLocaleString("vi-VN")}₫
          </p>
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>
              ⭐ {rating} | Đã bán {sold.toLocaleString("vi-VN")}
            </span>
            <span>{location}</span>
          </div>
        </div>
        {/* Button on hover */}
        <button
          className="absolute -bottom-9 left-0 z-20 w-full cursor-pointer bg-orange-500 py-2 text-sm text-white opacity-0 transition group-hover:opacity-100 hover:opacity-100"
          onClick={(e) => {
            e.preventDefault(); // Ngăn chuyển trang khi click vào nút
          }}
        >
          Tìm sản phẩm tương tự
        </button>
      </div>
    </Link>
  );
};

export default ItemProduct;
