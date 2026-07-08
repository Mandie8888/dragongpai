// Lunar Valentine's Free Trial promotion config
export const PROMO_START = new Date("2026-02-14T00:00:00Z");
export const PROMO_END = new Date("2026-02-24T23:59:59Z");
export const PROMO_CREDITS = 10;
export const STANDARD_CREDITS = 5;

export const isPromoActive = () => {
  const now = new Date();
  return now >= PROMO_START && now <= PROMO_END;
};

export const promoDaysRemaining = () => {
  const now = new Date();
  if (now > PROMO_END) return 0;
  return Math.max(0, Math.ceil((PROMO_END.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
};
