import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

interface StockDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  stockName?: string;
  isLoading?: boolean;
}

const StockDeleteDialog: React.FC<StockDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  stockName,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // エラーは親コンポーネントで処理
      console.error('Delete confirmation error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>削除しますか？</DialogTitle>
      <DialogContent>
        <Typography>
          {stockName ? `「${stockName}」の` : ''}
          入力内容が削除されます。よろしいですか？
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          いいえ
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockDeleteDialog;
