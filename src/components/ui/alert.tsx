import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="alert" className={cn("rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive", className)} {...props} />;
}
