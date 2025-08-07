import { ProductListFilter } from "@utils/constants/types/product.type";
import { pickBy } from "lodash";
import { useNavigate, useSearchParams } from "react-router-dom";

// 1. Chuyển queryParams → ProductListFilter
const parseProductListFilter = (queryParams: {
  [key: string]: string;
}): ProductListFilter => {
  return {
    keyword: queryParams.keyword ?? "",
    sortBy: ["ctime", "price", "sold", "relevancy"].includes(queryParams.sortBy)
      ? (queryParams.sortBy as "ctime" | "price" | "sold" | "relevancy")
      : "ctime",
    order: ["asc", "desc"].includes(queryParams.order)
      ? (queryParams.order as "asc" | "desc")
      : "asc",
    page: parseInt(queryParams.page || "1", 10),
    size: parseInt(queryParams.size || "20", 10),
    ...(queryParams.stock && { stock: parseInt(queryParams.stock, 10) }),
    ...(queryParams.minPrice && { minPrice: parseFloat(queryParams.minPrice) }),
    ...(queryParams.maxPrice && { maxPrice: parseFloat(queryParams.maxPrice) }),
    ...(queryParams.categoryId && {
      categoryId: parseInt(queryParams.categoryId, 10),
    }),
  };
};

// 2. Chuyển ProductListFilter → URLSearchParams

export const buildQueryParamsFromFilter = (
  filter: ProductListFilter,
): URLSearchParams => {
  const cleaned = pickBy(filter, (value, key) => {
    if (key === "sortBy")
      return ["ctime", "price", "sold", "relevancy"].includes(value as string);
    if (key === "order") return ["asc", "desc"].includes(value as string);
    if (key === "page")
      return typeof value === "number" && Number.isInteger(value) && value >= 0;
    if (key === "size")
      return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0 &&
        value <= 100
      );
    if (["stock", "minPrice", "maxPrice", "categoryId"].includes(key))
      return (
        value !== undefined &&
        value !== null &&
        typeof value === "number" &&
        !isNaN(value)
      );
    if (key === "keyword")
      return typeof value === "string" && value.trim() !== "";
    return false;
  });

  const params = new URLSearchParams();
  Object.entries(cleaned).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  return params;
};

// 3. Hook chính
export const useProductFilter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParams = Object.fromEntries([...searchParams]);
  const filter = parseProductListFilter(queryParams);

  const updateFilter = (newFilter: Partial<ProductListFilter>) => {
    const updated = { ...filter, ...newFilter };
    const newParams = buildQueryParamsFromFilter(updated);
    navigate(`?${newParams.toString()}`);
  };
  const resetFilter = () => {
    navigate(`?`);
  };

  return { filter, updateFilter, resetFilter };
};
