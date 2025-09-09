import { useEffect, useState } from 'react';
import type { KpiCardProps } from '../components/KpiCard';
import { generateKpiData } from '../../../mocks/kpi';
import { convertCSVFromArray } from '../../../utils/convertCSVFromArray';
import type { ModelCustomer, ModelOrder, ModelStock } from '../../../api/generated/model';

const useKpiCardProps = ({
  orders,
  customers,
  stocks,
}: {
  orders: ModelOrder[];
  customers: ModelCustomer[];
  stocks: ModelStock[];
}) => {
  const [kpiCardProps, setKpiCardProps] = useState<KpiCardProps[]>([]);
  useEffect(() => {
    const kpi = generateKpiData(orders, customers, stocks);
    setKpiCardProps([
      {
        title: kpi.orders.title,
        value: kpi.orders.value,
        trend: kpi.orders.trend,
        getCsvData: () => convertCSVFromArray(orders),
        csvFilename: 'orders.csv',
      },
      {
        title: kpi.stocks.title,
        value: kpi.stocks.value,
        trend: kpi.stocks.trend,
        getCsvData: () => convertCSVFromArray(stocks),
        csvFilename: 'stocks.csv',
      },
      {
        title: kpi.customers.title,
        value: kpi.customers.value,
        trend: kpi.customers.trend,
        getCsvData: () => convertCSVFromArray(customers),
        csvFilename: 'customers.csv',
      },
    ]);
  }, [customers, orders, stocks]);
  return kpiCardProps;
};

export default useKpiCardProps;
