import { Button } from "@components/Form/Button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">
        Oops! Không tìm thấy trang bạn yêu cầu.
      </p>
      <p className="mt-2 text-gray-500">
        Trang có thể đã bị xóa hoặc đường dẫn không đúng.
      </p>
      <Link to="/" className="mt-6">
        <Button title="Quay về trang chủ" isSubmitting={false} />
      </Link>
    </div>
  );
};

export default NotFound;
