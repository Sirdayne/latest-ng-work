export interface OrderDepthI {
  buyerAmount: string;
  buyerOrderId: string;
  buyerQty: string;
  buyerRate: string;
  currency: string;
  haircut: string;
  mdReqId: string;
  period: number;
  refPrice: string;
  repoPrice: string;
  security: string;
  sellerAmount: string;
  sellerOrderId: string;
  sellerQty: number;
  sellerRate: string;
}
