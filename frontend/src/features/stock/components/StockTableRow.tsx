import { TableRow, TableCell, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { ModelStock } from '../../../api/generated/model';
import { useI18n } from '../../../providers/I18nProvider';

interface StockTableRowProps {
  stock: ModelStock;
  columnWidths: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    created: string;
    updated: string;
  };
  isMobile: boolean;
  onEdit?: (stock: ModelStock) => void;
  onDelete?: (stock: ModelStock) => void;
}

const StockTableRow = ({
  stock,
  columnWidths,
  isMobile,
  onEdit,
  onDelete,
}: StockTableRowProps) => {
  const { formatDate } = useI18n();

  const formatCurrency = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
        '&:nth-of-type(even)': {
          backgroundColor: '#fbfbfb',
        },
      }}
    >
      <TableCell
        sx={{
          width: columnWidths.id,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {stock.id || '-'}
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.name,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {stock.name || '-'}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: columnWidths.price,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#2e7d32',
        }}
      >
        {formatCurrency(stock.price)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          width: columnWidths.quantity,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          py: 1.5,
          fontSize: '0.875rem',
        }}
      >
        {stock.quantity || 0}
      </TableCell>
      {!isMobile && (
        <TableCell
          sx={{
            width: columnWidths.created,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            py: 1.5,
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {formatDate(stock.created_at) || '-'}
        </TableCell>
      )}
      <TableCell
        sx={{
          width: columnWidths.updated,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          py: 1.5,
          fontSize: '0.875rem',
          color: '#666',
        }}
      >
        {formatDate(stock.updated_at) || '-'}
      </TableCell>
      <TableCell
        sx={{
          py: 1.5,
          width: '120px',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {onEdit && (
            <Tooltip title="編集">
              <IconButton
                size="small"
                onClick={() => onEdit(stock)}
                sx={{ color: '#1976d2' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="削除">
              <IconButton
                size="small"
                onClick={() => onDelete(stock)}
                sx={{ color: '#d32f2f' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default StockTableRow;
