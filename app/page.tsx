import { PricingTable } from "@/core/services/clerk/components/ClerkPricingTable";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <SignInButton />
      <UserButton />
      <PricingTable />
    </>
  );
}
