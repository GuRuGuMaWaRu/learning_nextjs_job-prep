import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <SignInButton />
      <UserButton />
    </>
  );
}
