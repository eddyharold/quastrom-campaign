import { ApiResponse } from "@/domain/types/api";
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiResponse;
  }
}
