import CheckBoxFilter from "@components/Filter";
import {
  faChevronLeft,
  faChevronRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useProductFilter } from "@hooks/useProductFilter";
import { FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ItemProduct from "@pages/Product/ItemProduct";
import productApi from "@service/product.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { sorts } from "@utils/constants/response";

import { ProductItem } from "@utils/constants/types/product.type";
import { useEffect, useState } from "react";

type SortType =
  | "ctime"
  | "price"
  | "sold"
  | "relevancy"
  | "price_asc"
  | "price_desc";

const ListProduct = () => {
  const getSortTypeFromFilter = (sortBy: string, order: string): SortType => {
    if (sortBy === "price" && order === "asc") return "price_asc";
    if (sortBy === "price" && order === "desc") return "price_desc";
    if (["ctime", "sold", "relevancy"].includes(sortBy))
      return sortBy as SortType;
    return "ctime";
  };
  const { filter, updateFilter, resetFilter } = useProductFilter();

  const [sortState, setSortState] = useState<SortType>(() =>
    getSortTypeFromFilter(filter.sortBy as string, filter.order as string),
  );

  useEffect(() => {
    setSortState(
      getSortTypeFromFilter(filter.sortBy as string, filter.order as string),
    );
  }, [filter.sortBy, filter.order]);

  const activeSort = getSortTypeFromFilter(
    filter.sortBy as string,
    filter.order as string,
  );

  const { data: listProduct } = useQuery({
    queryKey: ["products", filter],
    queryFn: () => productApi.getAllProducts(filter),
    placeholderData: keepPreviousData,
  });

  const { data: listCategory } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productApi.getCategories(),
  });

  const searchFilters = [
    {
      id: "category",
      filter: {
        key: "categoryId",
        name: "Theo Danh Mục",
        value: listCategory?.content ?? [],
        type: "radio",
      },
    },
  ];

  const currentPage = listProduct?.data?.page?.number;

  const totalPages = listProduct?.data?.page?.totalPages;

  const sortedProducts = [...(listProduct?.data?.content ?? [])].sort(
    (a, b) => {
      if (sortState === "price_asc") {
        return a.price - b.price;
      }
      if (sortState === "price_desc") {
        return b.price - a.price;
      }
      return 0;
    },
  );

  const handleSort = (id: SortType) => {
    if (id === "price_asc") {
      updateFilter({ ...filter, sortBy: "price", order: "asc" });
    } else if (id === "price_desc") {
      updateFilter({ ...filter, sortBy: "price", order: "desc" });
    } else {
      updateFilter({
        ...filter,
        sortBy: id as "ctime" | "relevancy" | "sold",
        order: "desc",
      });
    }
  };

  return (
    <section className="grid h-full w-full bg-[#f5f5f5] py-6 lg:grid-cols-12 lg:px-20">
      <div className="lg:col-span-2">
        <div className="mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} style={{ color: "#4c4444" }} />
          <h3 className="text-base font-bold">Bộ lọc tìm kiếm</h3>
        </div>
        {searchFilters.map((item) => (
          <CheckBoxFilter key={item.id} filterData={item.filter} />
        ))}

        <button
          className="mt-2 w-full cursor-pointer rounded bg-[#ee4d2d] py-2 text-sm text-white hover:opacity-90"
          onClick={resetFilter}
        >
          Xoá tất cả
        </button>
      </div>

      <div className="pl-2.5 lg:col-span-10">
        {/* Sort */}
        <div className="flex w-full justify-between gap-10 bg-gray-200 px-5 py-3.5 text-sm">
          <div className="flex items-center">
            <span>Sắp xếp theo</span>
            {sorts.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleSort(item.id as SortType);
                  }}
                  className={`ml-3 cursor-pointer rounded px-3.5 py-2 ${sortState === item.id ? "bg-[#ee4d2d] text-white" : "bg-white text-gray-700"}`}
                >
                  {item.value}
                </button>
              );
            })}
            <FormControl sx={{ minWidth: 200 }} size="small">
              <Select
                id="price"
                value={
                  ["price_asc", "price_desc"].includes(sortState)
                    ? sortState
                    : ""
                }
                label="Sắp xếp theo giá"
                input={<OutlinedInput />}
                onChange={(e) => handleSort(e.target.value as SortType)}
                sx={{
                  backgroundColor: "white",
                  color: activeSort ? "#ee4d2d" : "#fff",
                }}
                renderValue={(selected) => {
                  if (selected === "price_asc") {
                    return "Giá: Thấp đến Cao";
                  }

                  if (selected === "price_desc") {
                    return "Giá: Cao đến Thấp";
                  }

                  // Nếu không phải sắp xếp theo giá → placeholder
                  return <span className="text-gray-400">Giá</span>;
                }}
                className="ml-6"
              >
                <MenuItem disabled value="">
                  <em>Giá</em>
                </MenuItem>
                <MenuItem value="price_asc">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="price_desc">Giá: Cao đến Thấp</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="text-amber-500">{currentPage}</span>/{totalPages}
            <div className="ml-3 flex gap-1">
              <button
                onClick={() => updateFilter({ page: currentPage - 1 })}
                title="Previous"
                className="cursor-pointer bg-white p-1.5 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage <= 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={() => updateFilter({ page: currentPage + 1 })}
                title="Next"
                className="cursor-pointer bg-white p-1.5 px-3 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage >= totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>

        {/* List Product */}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {sortedProducts.length === 0 ? (
            <div className="col-span-5 flex w-full items-center justify-center py-10 text-lg text-gray-500">
              Không có sản phẩm nào được tìm thấy
            </div>
          ) : (
            sortedProducts.map((item: ProductItem) => (
              <ItemProduct key={item.id} {...item} />
            ))
          )}
        </div>

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="mt-10 flex w-full items-center justify-center gap-2">
            {listProduct?.data?.page && (
              <Pagination
                onChange={(e, page) => updateFilter({ page })}
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "gray",
                    "&.Mui-selected": {
                      backgroundColor: "#ee4d2d",
                      color: "#fff",
                    },
                  },
                }}
                count={totalPages}
                page={currentPage}
                variant="outlined"
                shape="rounded"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ListProduct;
