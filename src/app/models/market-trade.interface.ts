export interface MarketTradeI {
  time: string;
  status: string;
  security: string;
  duration: number;
  repoRate: number;
  quantity: number;
  amount: number;
  repurchaseDate: string;
  repurchaseValue: number;
  deltaRepoIncome: number;
  repoPrice: number;
}
