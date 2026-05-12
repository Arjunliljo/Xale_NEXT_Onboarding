import MarketingNav from "@/src/components/marketing/nav/MarketingNav";
import MarketingFooter from "@/src/components/marketing/footer/MarketingFooter";
import LenisProvider from "@/src/components/marketing/scroll/LenisProvider";
import Cursor from "@/src/components/marketing/cursor/Cursor";
import InitialLoader from "@/src/components/marketing/loader/InitialLoader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <InitialLoader />
      <Cursor />
      <div className="marketing-shell">
        <MarketingNav />
        <main>{children}</main>
        <MarketingFooter />
      </div>
    </LenisProvider>
  );
}
