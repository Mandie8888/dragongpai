export const STRIPE_PLANS = {
  coffee: {
    price_id: "price_1T02v5JuZJMy1Lc3v6jaYdgX",
    product_id: "prod_TxysgOEXWrFeSp",
    mode: "payment" as const,
  },
  pro: {
    price_id: "price_1T02vLJuZJMy1Lc3KYmNF7La",
    product_id: "prod_Txytl4QNrj5za2",
    mode: "subscription" as const,
  },
  vip: {
    price_id: "price_1T02vYJuZJMy1Lc3S8rB8SUg",
    product_id: "prod_TxytHdL9HGsuln",
    mode: "subscription" as const,
  },
} as const;
