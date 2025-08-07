import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "react-toastify";

// ApiError.ts
export class ApiError extends Error {
  status?: number;
  error?: string;
  detailMessage?: string | object;

  constructor(detailError: {
    status?: number;
    error?: string;
    message?: string | object;
  }) {
    super(
      typeof detailError.message === "string"
        ? detailError.message
        : JSON.stringify(detailError.message),
    );
    this.name = "ApiError";
    this.status = detailError.status;
    this.error = detailError.error;
    this.detailMessage = detailError.message;

    // Set prototype manually vì TS/JS khi kế thừa Error cần set lại prototype
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const showValidatorMessage = <T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
) => {
  if (error instanceof ApiError) {
    const { detailMessage } = error;

    if (Array.isArray(detailMessage)) {
      detailMessage.forEach((message: Record<string, string>) => {
        const key = Object.keys(message)[0] as keyof T;

        setError(key as Path<T>, {
          type: "manual", // ✅ Bắt buộc
          message: message[key as string],
        });
      });

      toast.error("Thao tác thất bại");
    } else {
      toast.error(detailMessage as string);
    }
  }
};
