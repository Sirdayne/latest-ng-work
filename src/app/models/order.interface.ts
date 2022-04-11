export interface OrderI {
  createdAt: string;
  transactTime: string;
  clOrdId: string;
  orderId: number;
  side: string;
  status: string;
  security: string;
  period: number;
  rate: number;
  autoQty: number;
  autoAmount: number;
  repurchaseDate: string;
  repurchaseAmount: number;
  type: string;
  subType: string;
  investor: string;
  allOrNone: boolean;
  partialQty: string;
  partialAmount: string;
  senderSubId: string;
}
