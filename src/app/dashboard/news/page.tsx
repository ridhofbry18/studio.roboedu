import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewsClient } from "./NewsClient";
import { getAllSpotlights } from "@/app/actions/spotlights";
import { cookies } from "next/headers";

export const metadata = {
  title: "News & Spotlights - RoboEdu QC Hub",
};

export default async function NewsPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  const spotlights = await getAllSpotlights();

  return <NewsClient initialSpotlights={spotlights} user={{ id: user.id, role: user.role }} />;
}
