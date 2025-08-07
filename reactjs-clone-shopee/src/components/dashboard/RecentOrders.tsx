export default function RecentOrders({ orders }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">Đơn hàng gần đây</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {orders.map((order, index) => (
          <li key={index} className="py-2">
            <div className="flex justify-between text-sm">
              <span>{order.customer}</span>
              <span>{order.amount}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{order.date}</span>
              <span>{order.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
