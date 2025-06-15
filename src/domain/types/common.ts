import { LucideIcon } from "lucide-react";
import { ComponentType, CSSProperties, ReactNode } from "react";

export type Breadcrumb = {
  title: string;
  link?: string;
  isActive?: boolean;
};

export type QueryParams = {
  limit?: number | null;
  page?: number | null;
  [key: string]: string | string[] | number | number[] | boolean | boolean[] | null | undefined;
};

export type GenericType = {
  [k: string]: string | number | boolean | null | undefined | GenericType | GenericType[];
};

export type IconType =
  | LucideIcon
  | ComponentType<{
      className?: string;
      size?: number;
    }>;

export type CommonProps = {
  className?: string;
  children?: ReactNode;
  styles?: CSSProperties;
};
