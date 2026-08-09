type FormMessageProps = {
  type: "error" | "warning" | "success";
  children: React.ReactNode;
};

// Single shared banner style for form feedback — replaces the previously
// inconsistent mix of bare colored text (most CRM forms) and colored
// background banners (only settings/calendar) with one convention used
// everywhere.
const STYLES: Record<FormMessageProps["type"], string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-green-200 bg-green-50 text-green-700",
};

export function FormMessage({ type, children }: FormMessageProps) {
  return (
    <p className={`rounded-lg border px-3 py-2 text-sm ${STYLES[type]}`}>
      {children}
    </p>
  );
}
