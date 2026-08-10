import HeaderClient from "@/components/layout/HeaderClient";
import { getSiteNavigation } from "@/lib/navigation";

export default async function Header() {
  const navigation = await getSiteNavigation();
  return <HeaderClient items={navigation.header} />;
}
