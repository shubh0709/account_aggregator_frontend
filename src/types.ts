export interface Amount {
  Float64: number;
  Valid: boolean;
}

export interface AccountData {
  Date: string;
  Description: string;
  Debit: Amount;
  Credit: Amount;
  Balance: Amount;
  AccountID: string;
}

export interface UserDetails {
  keywords: string[];
  bankAccounts: string[];
}

export interface TrendData {
  period: string;
  total_credit: number;
  total_debit: number;
}

export interface AggregateData {
  total_credit: number;
  total_debit: number;
  category: string;
  total: number;
}
