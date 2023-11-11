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
