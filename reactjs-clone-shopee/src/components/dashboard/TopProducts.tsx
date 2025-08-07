export default function TopProducts({ products }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">Sản phẩm bán chạy</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {products.map((product, index) => (
          <li key={index} className="py-2 text-sm">
            <div className="flex justify-between">
              <span>{product.name}</span>
              <span>{product.price}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Đã bán: {product.sold}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
