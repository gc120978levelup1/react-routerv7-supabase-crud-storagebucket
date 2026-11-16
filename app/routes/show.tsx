
import type { Route } from "./+types/show";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Show Item" },
    { name: "description", content: "Shows 1 item from Table1" },
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
  const { data: todos } = await supabase.from("table1").select("*").eq("id", params.id);
  return { todos };
}

export default function Show({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id} className=" flex flex-row gap-2">
            {todo.name} {todo.age} <p> <a href=""></a></p>
          </li>
        ))}
      </ul>
    </>
  );
}
