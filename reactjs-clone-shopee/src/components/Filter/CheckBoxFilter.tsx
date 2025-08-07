import { useProductFilter } from "@hooks/useProductFilter";

interface FilterCheckBox {
  filterData: {
    [key: string]: any; // <- thêm dòng này
    name: string;
    value?: Array<{ id: string; name: string }>;
    type?: string;
  };
}

const CheckBoxFilter = ({ filterData }: FilterCheckBox) => {
  const { filter, updateFilter } = useProductFilter();
  const key = filterData.key;

  // Active item dựa vào key động
  const activeValue = filter[key]?.toString();

  const handleFilter = (id: string) => {

    updateFilter({ ...filter, [key]: Number(id) });
  };

  return (
    <div className="border-b border-gray-300 pb-4">
      <h4 className="mb-1">{filterData.name}</h4>
      {(filterData.value || []).map((item) => {
        const isChecked = activeValue === item.id.toString();

        return (
          <div
            key={`${item.id}-${key}`}
            className="flex cursor-pointer items-center gap-2 p-1"
          >
            <input
              onChange={() => handleFilter(item.id)}
              type={filterData.type ?? "checkbox"}
              name={filterData.name}
              id={`${item.id}-${key}`}
              title={item.name}
              className="cursor-pointer"
              checked={isChecked}
            />

            <label
              htmlFor={`${item.id}-${key}`}
              className={`${isChecked ? "text-amber-600" : ""} cursor-pointer`}
            >
              {item.name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default CheckBoxFilter;
