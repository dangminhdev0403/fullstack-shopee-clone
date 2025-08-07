const LoadingSkeleton = () => {
  return (
    <div className="w-full p-4 md:p-8">
      {/* Hero section skeleton */}
      <div className="mb-8 h-48 w-full animate-pulse rounded-lg bg-gray-200 md:h-64"></div>

      {/* Content sections */}
      <div className="mb-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>

        {/* Text lines skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-4 w-full animate-pulse rounded bg-gray-200"
            ></div>
          ))}
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
