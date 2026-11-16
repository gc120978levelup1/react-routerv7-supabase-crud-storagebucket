import type { Route } from "./+types/password";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Change Password" },
    { name: "description", content: "Page for User to Change Password" },
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
  return { user };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const current_password = formData.get("current_password") as string;
  const password = formData.get("password") as string;
  const retype_password = formData.get("retype_password") as string;
  const { supabase } = createClientSPA();
  let userId = "";
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    userId = user.email as string;
  }
  console.log("password1", password);
  console.log("password2", retype_password);
  if (password == retype_password) {
    const { error } = await supabase.auth.updateUser({
      email: userId,
      current_password: current_password,
      password: password,
    });
    if (!error) return redirect(`/`);
  } else {
    console.log("password do not match");
  }

  //console.log("garry data ", data);
  //console.log("garry error ", error);
}

export default function Login({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Change Password</h1>
      <h3>User: {loaderData.user.email}</h3>
      <Form method="post" className="flex flex-col">
        <div className="flex flex-row gap-2">
          <label htmlFor="current_password">current password</label>
          <input
            type="password"
            name="current_password"
            id="current_password"
          />
        </div>
        <div className="flex flex-row gap-2">
          <label htmlFor="password">new password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="flex flex-row gap-2">
          <label htmlFor="retype_password">retype new password</label>
          <input type="password" name="retype_password" id="retype_password" />
        </div>
        <div>
          <button
            className=" rounded-lg border-2 p-2 hover:text-blue-800 hover:bg-amber-200 hover:cursor-pointer"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </>
  );
}
