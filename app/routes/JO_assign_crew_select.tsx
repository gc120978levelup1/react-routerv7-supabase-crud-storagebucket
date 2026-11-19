// this specific page component import
// specific component import
// this specific page component import


// rrv7 import
import type { Route } from "./+types/JO_assign_crew_select";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code
  const { error } = await supabase
    .from("jobs")
    .update({
      crewId: params.crewId,
      dateAssigned: new Date(),
      status: "assigned",
    })
    .eq("id", params.id);

  return redirect(`/JO_show/${params.id}`);
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  return (
    <>
    </>
  );
}
