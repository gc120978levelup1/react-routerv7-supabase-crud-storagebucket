import type { Route } from "./+types/login";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Logout Page" },
    { name: "description", content: "Page for User to Logout" },
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
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const { supabase } = createClientSPA();
  const { error } = await supabase.auth.signOut();
  //console.log("garry error ", error);

  if (!error) return redirect(`/login`);
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Sign Out?</h1>
      <Form method="post" className="flex flex-col">
        <div>
          <button
            className=" rounded-lg border-2 p-2 hover:text-blue-800 hover:bg-amber-200 hover:cursor-pointer"
            type="submit"
          >
            Logout
          </button>
        </div>
      </Form>
    </>
  );
}
