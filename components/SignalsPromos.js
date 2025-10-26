// components/SidebarPromos.js
import TopExchanges from "./TopExchanges";
import BestWallets from "./BestWallets";
import TopStaking from "./TopStaking";

export default function SidebarPromos() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <TopExchanges variant="sidebar" />
      <BestWallets variant="sidebar" />
      <TopStaking variant="sidebar" />
    </div>
  );
}
