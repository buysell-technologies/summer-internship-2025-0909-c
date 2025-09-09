import { useState } from 'react';
import {
  useGetStocks,
  usePostStocks,
  usePutStocksId,
  useDeleteStocksId,
} from '../../api/generated/api';
import StockTable from '../../features/stock/components/StockTable';
import StockFormModal from '../../features/stock/components/StockFormModal';
import StockDeleteDialog from '../../features/stock/components/StockDeleteDialog';
import { type StockFormData } from '../../features/stock/schemas/StockFormSchema';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  Snackbar,
} from '@mui/material';
import type { ModelStock } from '../../api/generated/model';
import { useAuth } from '../../hooks/useAuth';

const StocksPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<ModelStock | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { userId, storeId } = useAuth();

  const { data, isLoading, error, refetch } = useGetStocks({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
  });

  const createStockMutation = usePostStocks();
  const updateStockMutation = usePutStocksId();
  const deleteStockMutation = useDeleteStocksId();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateStock = async (formData: StockFormData) => {
    try {
      await createStockMutation.mutateAsync({
        data: {
          ...formData,
          store_id: storeId || '',
          user_id: userId || '',
        },
      });
      showSnackbar('在庫を登録しました', 'success');
      refetch();
    } catch (error) {
      showSnackbar('在庫の登録に失敗しました', 'error');
      throw error;
    }
  };

  const handleUpdateStock = async (formData: StockFormData) => {
    if (!selectedStock?.id) return;

    try {
      await updateStockMutation.mutateAsync({
        id: selectedStock.id,
        data: {
          ...formData,
          store_id: storeId || '',
          user_id: userId || '',
        },
      });
      showSnackbar('在庫を更新しました', 'success');
      refetch();
    } catch (error) {
      showSnackbar('在庫の更新に失敗しました', 'error');
      throw error;
    }
  };

  const handleDeleteStock = async () => {
    if (!selectedStock?.id) return;

    try {
      await deleteStockMutation.mutateAsync({ id: selectedStock.id });
      showSnackbar('在庫を削除しました', 'success');
      refetch();
    } catch (error) {
      showSnackbar('在庫の削除に失敗しました', 'error');
      throw error;
    }
  };

  const handleNewStock = () => {
    setSelectedStock(null);
    setFormModalOpen(true);
  };

  const handleEditStock = (stock: ModelStock) => {
    setSelectedStock(stock);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (stock: ModelStock) => {
    setSelectedStock(stock);
    setDeleteDialogOpen(true);
  };

  const handleFormModalClose = () => {
    setFormModalOpen(false);
    setSelectedStock(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedStock(null);
  };

  const isFormLoading =
    createStockMutation.isPending || updateStockMutation.isPending;
  const isDeleteLoading = deleteStockMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          在庫データの取得中にエラーが発生しました。
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          再試行
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'min-content',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            fontWeight: 600,
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          在庫管理
        </Typography>
        <Button
          variant="contained"
          onClick={handleNewStock}
          sx={{ minWidth: '120px' }}
        >
          新規登録
        </Button>
      </Box>
      <Box
        sx={{
          p: 3,
        }}
      >
        <StockTable
          stocks={data || []}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onEdit={handleEditStock}
          onDelete={handleDeleteClick}
        />
      </Box>

      <StockFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        onSubmit={selectedStock ? handleUpdateStock : handleCreateStock}
        stock={selectedStock}
        isLoading={isFormLoading}
      />

      <StockDeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteStock}
        stockName={selectedStock?.name}
        isLoading={isDeleteLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

export default StocksPage;
