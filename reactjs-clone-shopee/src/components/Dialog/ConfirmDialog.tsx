import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    maxWidth: 400,
    width: "90%",
    boxShadow: theme.shadows[5],
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: theme.shape.borderRadius,
}));

const ConfirmDialog = ({
  confirmOpen,
  handleCancelDelete,
  handleRemoveItems,
  selectedItems,
}) => {
  return (
    <StyledDialog
      open={confirmOpen}
      onClose={handleCancelDelete}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      role="alertdialog"
      transitionDuration={0}
    >
      <StyledDialogTitle id="confirm-dialog-title">
        <DeleteIcon />
        <Typography variant="h6">Xác nhận xóa</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleCancelDelete} aria-label="Đóng">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText id="confirm-dialog-description">
          <Typography variant="body1" color="text.primary">
            Bạn có chắc chắn muốn xóa{" "}
            <strong>{selectedItems.length} sản phẩm</strong> đã chọn khỏi giỏ
            hàng không?
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={handleRemoveItems}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ minWidth: 100 }}
          autoFocus
        >
          Xóa
        </Button>
        <Button
          onClick={handleCancelDelete}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmDialog;
