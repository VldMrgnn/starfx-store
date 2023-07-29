export interface IAppNotify {
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
  position?: "top" | "bottom";
}
