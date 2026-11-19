// this specific page component import
// specific component import
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ShieldLock, Save } from "lucide-react";

// usual component import
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { SidebarTrigger } from "~/components/ui/sidebar";

// rrv7 import
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
  //console.log("password1", password);
  //console.log("password2", retype_password);
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
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  My Account - Change Password, User Email:{" "}
                  <span className=" p-2 bg-blue-950 font-extrabold">
                    {loaderData.user.email}
                  </span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <Card className=" mx-5 md:mx-20 my-auto">
          <CardHeader>
            <CardTitle className=" flex flex-row gap-3">
              <ShieldLock />
              Edit Password
            </CardTitle>
            <CardDescription>
              Edit User: {loaderData.user.email} password
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent className=" bg-gray-900/30 py-10 m-2">
            <div className="mx-auto gap-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label htmlFor="current_password">current password</Label>
                <Input
                  type="password"
                  name="current_password"
                  id="current_password"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">new password</Label>
                <Input type="password" name="password" id="password" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="current_password">re-type password</Label>
                <Input
                  type="password"
                  name="retype_password"
                  id="retype_password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <h1>Do you want to save the changes to your password?</h1>
            <div className=" ml-auto">
              <button
                className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                type="submit"
              >
                <Save />
                Yes, Save
              </button>
            </div>
          </CardFooter>
        </Card>
      </Form>
    </>
  );
}
