import { z } from 'zod';

export const stockFormSchema = z.object({
  name: z
    .string()
    .min(1, '商品名は必須です')
    .max(100, '商品名は100文字以内で入力してください'),
  price: z
    .number()
    .min(0, '価格は0円以上で入力してください')
    .int('価格は整数で入力してください'),
  quantity: z
    .number()
    .min(0, '在庫数は0個以上で入力してください')
    .int('在庫数は整数で入力してください'),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
