import type { Route } from "./+types/add";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Add Item" },
    { name: "description", content: "Adds 1 item to Table1" },
  ];
}
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // middleware to guard route from unauthorized entry
  const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code

}
export async function clientAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const { supabase } = createClientSPA();
  const { error } = await supabase.from("table1").insert({ name, age });
  return redirect(`/`);
}

export default function Add() {
  return (
    <>
      <h1>Add New Item</h1>
      <Form method="post" className="flex flex-col">
        <div className="flex flex-row gap-2">
          <label htmlFor="name">name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div className="flex flex-row gap-2">
          <label htmlFor="age">age</label>
          <input type="number" name="age" id="age" />
        </div>
        <div className=" mt-2">
          <button className=" rounded-lg border-2 p-2 hover:text-blue-800 hover:bg-amber-200 hover:cursor-pointer" type="submit">Submit</button>
        </div>
      </Form>
    </>
  );
}
