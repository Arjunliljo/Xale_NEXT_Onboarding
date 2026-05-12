import QueryProvider from "@/src/providers/QueryProvider";
import ReduxProvider from "@/src/providers/ReduxProvider";
import ToastProvider from "@/src/providers/ToastProvider";

export const dynamic = "force-dynamic";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </ReduxProvider>
  );
}
