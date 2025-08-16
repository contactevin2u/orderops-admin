export type Intent = "RETURN" | "COLLECT" | "INSTALMENT_CANCEL" | "BUYBACK" | null;

export type ParsedAI = {
  order_code?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  intent?: Intent;
};

export type Parsed = {
  ai?: ParsedAI;
  matcher: string;   // "ai"
  lang: "en" | "ms";
  raw_preview?: string;
};

export type Match = {
  order_code: string;
  reason: string;
};

export type DeliveryIn = {
  outbound_fee: number;
  return_fee: number;
  prepaid_outbound: boolean;
  prepaid_return: boolean;
};

export type PlanIn = {
  months?: number | null;
  start_date?: string | null; // YYYY-MM-DD
};

export type ScheduleIn = {
  date?: string | null; // YYYY-MM-DD
  time?: string | null; // HH:MM
};

export type Item = {
  sku: string;
  name: string;
  qty: number;
  unit_price?: number | null;
  rent_monthly?: number | null;
  buyback_rate?: number | null; // 0..1
};

export type OrderCreate = {
  code: string;
  type: "OUTRIGHT" | "INSTALMENT" | "RENTAL";
  customer: { name: string; phone?: string | null; address?: string | null };
  plan_months?: number | null;
  plan_monthly_amount?: number | null;
  plan_start_date?: string | null;
  plan?: PlanIn | null;
  schedule?: ScheduleIn | null;
  items: Item[];
  delivery: DeliveryIn;
};

export type ListOrderRow = {
  code: string;
  type: "OUTRIGHT" | "INSTALMENT" | "RENTAL";
  status: "OPEN" | "CLOSED";
  customer: { name: string; phone?: string | null };
  created_at: string;
  outstanding: number;
};

export type OrderDetail = {
  order: { code: string; created_at: string };
  meta: any;
  items: any[];
  charges: any[];
  payments: any[];
  events: any[];
  summary: {
    principal: number;
    delivery: number;
    penalty: number;
    accrual: number;
    other_credits: number;
    paid: number;
    total_due: number;
    outstanding: number;
  };
};
