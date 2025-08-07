import { ArrowDownRight, ArrowUpRight, Zap } from "lucide-react";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
          />
          <div className="flex items-center justify-between p-6 pb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </h3>
            <div className={`rounded-2xl p-3 ${stat.bgColor}`}>
              <stat.icon
                className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="mb-2 text-3xl font-bold">{stat.value}</div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
              </div>
              {stat.realtime && (
                <span className="inline-flex items-center rounded-full border bg-green-50 px-2 py-1 text-xs text-green-700">
                  <Zap className="mr-1 h-3 w-3" /> Live
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
