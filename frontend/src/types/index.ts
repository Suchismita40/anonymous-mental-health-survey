export interface SurveyResponseInput {
  moodScore: number;
  anxietyScore: number;
  stressScore: number;
}

export interface AggregateAnalytics {
  totalSubmissions: number;
  avgMood: number;
  avgAnxiety: number;
  avgStress: number;
  lowRiskCount: number;
  moderateRiskCount: number;
  highRiskCount: number;
  isSurveyActive: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  network: string;
  isLaceAvailable: boolean;
}

export interface TransactionReceipt {
  txId: string;
  blockHeight: number;
  timestamp: string;
}
