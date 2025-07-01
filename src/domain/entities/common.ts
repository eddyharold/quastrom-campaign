export interface Objective {
  id: number;
  name: string;
  icon: string | null;
  description: string;
  price_lead: string;
  validation_conditions: ValidationCondition[];
  created_at: string | null;
  updated_at: string | null;
  code: string;
}

export interface ValidationCondition {
  label: string;
  name: string;
  description: string;
}

export interface Creative {
  name: string;
  description: string;
  code: string;
  price: number;
}
