const LoadingSpinner = () => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="relative h-20 w-20">
        <div className="absolute h-full w-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-transparent border-t-gray-700"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
