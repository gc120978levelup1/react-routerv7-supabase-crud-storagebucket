// this specific page component import
// specific component import
// this specific page component import

// rrv7 import
import type { Route } from "./+types/JO_assign_crew_select";
import { redirect } from "react-router";
import { authGuard } from "~/auth/Login";
import { job_edit } from "~/models/Jobs";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const todos = await job_edit(params.id, {
    crewId: params.crewId,
    dateAssigned: new Date(),
    status: "assigned",
  });

  return redirect(`/JO_show/${params.id}`);
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  return <></>;
}
