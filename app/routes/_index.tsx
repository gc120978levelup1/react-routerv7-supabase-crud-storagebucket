
import type { Route } from "./+types/_index";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Master List" },
    { name: "description", content: "Lists of Table 1 data" },
  ];
}
export async function clientLoader({ request }: Route.ClientLoaderArgs) { //on_load_page
  // middleware to guard route from unauthorized entry
  const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code
  const { data: todos } = await supabase.from("table1").select();
  return { todos };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Items Masterlist</h1>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id} className=" flex flex-row gap-3">
            {todo.id} {todo.name} {todo.age}{" "}
            <div>
              <a href={`show/${todo.id}`}>show</a>
            </div>{" "}
            <div>
              <a href={`edit/${todo.id}`}>edit</a>
            </div>
            <div>
              <a href={`delete/${todo.id}`}>delete</a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
