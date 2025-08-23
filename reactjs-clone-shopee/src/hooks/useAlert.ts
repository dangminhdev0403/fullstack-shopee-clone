import Swal from "sweetalert2";

export function useAlert() {
  // Xác nhận có/không
  const confirm = (title: string, text: string, onConfirm?: () => void) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed && onConfirm) onConfirm();
    });
  };

  // Thông báo thành công
  const success = (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // Thông báo thất bại
  const error = (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  // Thông báo thông tin
  const info = (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  // Thông báo cảnh báo
  const warning = (title: string, text?: string) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  return { confirm, success, error, info, warning };
}
