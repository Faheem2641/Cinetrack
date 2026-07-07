import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth();

  return (
    <NavbarClient session={session} logoutAction={logoutAction} />
  );
}
