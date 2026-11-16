import type { Route } from "./+types/edit";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Edit Item" },
    { name: "description", content: "Edit 1 item from Table1" },
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
  const { data: todos } = await supabase
    .from("table1")
    .select("*")
    .eq("id", params.id);
  return { todos };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const { supabase } = createClientSPA();
  const { error } = await supabase
    .from("table1")
    .update({ name, age })
    .eq("id", params.id);
  return redirect(`/show/${params.id}`);
}

export default function Edit({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Modify Item</h1>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Form method="post" className="flex flex-col">
              <div className="flex flex-row gap-2">
                <label htmlFor="name">name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={todo.name}
                />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor="age">age</label>
                <input
                  type="text"
                  name="age"
                  id="age"
                  defaultValue={todo.age}
                />
              </div>
              <div>
                <button className=" mt-2 rounded-lg border-2 p-2 hover:text-blue-800 hover:bg-amber-200 hover:cursor-pointer"  type="submit">Submit</button>
              </div>
            </Form>
          </li>
        ))}
      </ul>
    </>
  );
}
