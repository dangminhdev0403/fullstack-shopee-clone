import { QuantityInput } from "@components/Form/InputText";
import ProductRating from "@components/Rating/ProductRating";
import {
  faCartArrowDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAddToCartMutation } from "@redux/api/cartApi";
import { cartSilice } from "@redux/slices/cartSlice";
import productApi from "@service/product.service";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@utils/constants/route";
import { formatNumber, getIdFromNameId } from "@utils/helper";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

interface ProductImage {
  id: number;
  imageUrl: string;
}

const ProductDetail = () => {
  const { nameId } = useParams();

  const id = getIdFromNameId(nameId as string);

  const { data: productDetailData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductDetail(id),
  });
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<number | undefined>(undefined);
  const [isImageUrl, setIsImageUrl] = useState<string | undefined>(undefined);
  const imageRef = useRef<HTMLImageElement>(null);
  const [quantity, setQuantity] = useState<number>(1); // set mặc định

  const [addToCart] = useAddToCartMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (productDetailData?.images?.length) {
      setIsActive(productDetailData.images[0].id);
      setIsImageUrl(productDetailData.images[0].imageUrl);
    }
  }, [productDetailData]);
  const handleActive = (id: number) => {
    setIsActive(id);
    const findImage = productDetailData?.images.find(
      (image: ProductImage) => image.id === id,
    );
    setIsImageUrl(findImage?.imageUrl);
  };

  const nextImage = () => {
    const index = productDetailData?.images.findIndex(
      (image: ProductImage) => image.id === isActive,
    );
    const nextIndex =
      index === productDetailData?.images.length - 1 ? 0 : index + 1;
    handleActive(productDetailData?.images[nextIndex].id);
  };

  const prevImage = () => {
    const index = productDetailData?.images.findIndex(
      (image: ProductImage) => image.id === isActive,
    );
    const prevIndex =
      index === 0 ? productDetailData?.images.length - 1 : index - 1;
    handleActive(productDetailData?.images[prevIndex].id);
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imageRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    const image = imageRef.current;
    image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    image.style.transform = "scale(2)";
  };

  const handleLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "scale(1)";
      imageRef.current.style.transformOrigin = "center center";
    }
  };

  const handleAddToCart = (id: string) => {
    addToCart({ productId: parseInt(id), quantity, action: "INCREASE" })
      .unwrap()
      .then(() => {
        // Handle success, e.g., show a success message
        toast.success("Thêm vào giỏ hàng thành công");
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.log(error);

        toast.error(` ${error.data.message}`);
      });
  };
  const handleBuyNow = (id: string) => {
    addToCart({ productId: parseInt(id), quantity, action: "INCREASE" })
      .unwrap()
      .then(() => {
        dispatch(cartSilice.actions.addItemToCart({ id: parseInt(id) }));
        // Handle success, e.g., navigate
        navigate(ROUTES.CART);

        toast.success("Hãy tiến hành đặt hàng");
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.log(error);
        toast.error(`Số lượng mua vượt quá tồn kho`);
      });
  };
  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto bg-white p-4 shadow">
        <div className="grid grid-cols-12 gap-9">
          <div className="col-span-5">
            <div
              className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow"
              onMouseMove={handleZoom}
              onMouseLeave={handleLeave}
            >
              <img
                ref={imageRef}
                src={isImageUrl}
                alt={isImageUrl}
                className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-200 ease-in-out"
              />
            </div>
            <div className="relative mt-3 grid grid-cols-5 gap-1">
              <button
                title="Previous"
                className="absolute top-1/2 left-0 z-10 h-10 w-10 -translate-y-1/2 cursor-pointer bg-[rgba(100,100,100,0.5)]"
                onClick={() => prevImage()}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {productDetailData?.images
                .slice(0, 5)
                .map((image: ProductImage) => {
                  const active = image.id === isActive;
                  return (
                    <div
                      key={image.id}
                      className="relative ml-2 w-full pt-[100%]"
                      onMouseEnter={() => handleActive(image.id)}
                    >
                      <img
                        src={image?.imageUrl}
                        alt={image?.imageUrl}
                        className="absolute top-0 left-0 h-full w-full bg-white object-cover"
                      />
                      {active && (
                        <div className="absolute inset-0 border-2 border-amber-500 opacity-50"></div>
                      )}
                    </div>
                  );
                })}
              <button
                title="Next"
                className="absolute top-1/2 right-0 z-10 h-10 w-10 -translate-y-1/2 cursor-pointer bg-[rgba(100,100,100,0.5)]"
                onClick={() => nextImage()}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          <div className="col-span-7">
            <h1 className="font-base text-xl uppercase">
              {productDetailData?.name}
            </h1>
            <div className="mt-8 flex items-center">
              <div>
                <ProductRating value={5} />
              </div>
              <div className="mx-4 h-6 w-[1px] bg-gray-400"></div>
              <div>
                <span>{formatNumber(50000)}</span>
                <span className="ml-2 text-gray-400">Đã bán</span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 bg-gray-50 px-5 py-4">
              <div className="text-gray-400 line-through">
                {productDetailData?.price.toLocaleString("vi-VN")}
              </div>
              <div className="ml-3 flex items-start gap-1 text-3xl leading-none text-orange-400">
                <span className="-mb-1 text-lg">đ</span>
                <span>{productDetailData?.price.toLocaleString("vi-VN")}</span>
              </div>
            </div>
            <div className="mt-8 flex items-center">
              <div className="text-gray-500 capitalize">Số lượng:</div>
              <div className="ml-10 flex items-center">
                <QuantityInput
                  value={quantity}
                  onChange={(val) => setQuantity(val)}
                  max={productDetailData?.stock}
                />{" "}
                <span className="ml-2 text-gray-500">
                  {productDetailData?.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <button
                title="Add to Cart"
                className="cursor-pointer border border-amber-500 bg-amber-50 p-3 text-amber-600"
                onClick={() => handleAddToCart(productDetailData?.id)}
              >
                <FontAwesomeIcon
                  icon={faCartArrowDown}
                  style={{ color: "#f05d40" }}
                />
                Thêm vào giỏ hàng
              </button>
              <button
                title="Buy Now"
                className="cursor-pointer border border-amber-500 bg-[#f05d40] p-3 text-white"
                onClick={() => handleBuyNow(productDetailData?.id)}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-4 bg-white p-4 shadow">
        <div>
          <h2 className="bg-gray-50 p-2 text-lg uppercase">
            CHI TIẾT SẢN PHẨM
          </h2>
          <div>
            <div className="flex items-center p-2">
              <p className="w-1/4 text-gray-400">Danh mục</p>
              <p>{productDetailData?.category?.name}</p>
            </div>
            <div className="flex items-center p-2">
              <p className="w-1/4 text-gray-400">Kho</p>
              <p>{productDetailData?.stock}</p>
            </div>
            <div className="flex items-center p-2">
              <p className="w-1/4 text-gray-400">Gửi từ</p>
              <p>Hồ Chí Minh</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="bg-gray-50 p-2 text-lg uppercase">MÔ TẢ SẢN PHẨM</h2>
          <div className="mt-4 text-sm leading-loose">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(productDetailData?.description),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
