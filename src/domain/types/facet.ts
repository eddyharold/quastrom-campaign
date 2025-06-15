import { LucideIcon } from "lucide-react";

export interface FacetDateRange {
  from?: string;
  end?: string;
}

export interface FacetOption {
  label: string;
  value: string;
  image?: string;
  icon?: LucideIcon;
}

export interface Facet {
  type: "unique" | "multiple" | "date";
  title: string;
  value?: string | string[] | Date | FacetDateRange;
  filterFn: (value?: string | string[] | FacetDateRange) => void;
  isLoading?: boolean;
  options?: FacetOption[];
}
