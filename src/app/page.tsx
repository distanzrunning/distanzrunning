import { redirect } from "next/navigation";

// TEMPORARY (homepage exploration): the root points at homepage mockup 1a so
// distanzrunning.vercel.app/ shows the new design directly instead of the old
// empty homepage + production SiteHeader. Compare the other directions at
// /home-mockups. Replace this with the finalized homepage once 1a is polished.
export default function Home() {
  redirect("/home-mockups/1a");
}
