// store/alertMiddleware.ts
import { clearAlert, showAlert } from "@redux/slices/alertSlice";
import { Middleware } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

export const alertMiddleware: Middleware = (store) => (next) => (action) => {
  if (showAlert.match(action)) {
    const { type, title, text, onConfirm } = action.payload;

    if (type === "confirm") {
      Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed && onConfirm) onConfirm();
        store.dispatch(clearAlert());
      });
    } else {
      Swal.fire({
        title,
        text,
        icon: type,
        confirmButtonText: "OK",
      }).then(() => {
        store.dispatch(clearAlert());
      });
    }
  }

  return next(action);
};
