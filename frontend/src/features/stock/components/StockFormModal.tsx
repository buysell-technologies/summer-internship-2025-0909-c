import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  stockFormSchema,
  type StockFormData,
} from '../schemas/StockFormSchema';
import type { ModelStock } from '../../../api/generated/model';

interface StockFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockFormData) => Promise<void>;
  stock?: ModelStock | null;
  isLoading?: boolean;
}

const StockFormModal: React.FC<StockFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  stock,
  isLoading = false,
}) => {
  const isEdit = !!stock;
  const title = isEdit ? '編集' : '登録';
  const submitButtonText = isEdit ? '更新する' : '登録する';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockFormData>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      name: stock?.name || '',
      price: stock?.price || 0,
      quantity: stock?.quantity || 0,
    },
  });

  // モーダルが開かれた時にフォームをリセット
  React.useEffect(() => {
    if (open) {
      reset({
        name: stock?.name || '',
        price: stock?.price || 0,
        quantity: stock?.quantity || 0,
      });
    }
  }, [open, stock, reset]);

  const handleFormSubmit = async (data: StockFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // エラーは親コンポーネントで処理
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="商品名"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="価格"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  disabled={isLoading}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="在庫数"
                  type="number"
                  fullWidth
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  disabled={isLoading}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} disabled={isLoading}>
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockFormModal;
