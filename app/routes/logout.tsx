// specific component import
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LogOut, SquareArrowRightExit } from "lucide-react";

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
import type { Route } from "./+types/login";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
//import { createClientSPA } from "../lib/supabase.client.spa";
import {supabase, headers} from "../lib/supabase-js";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Logout Page" },
    { name: "description", content: "Page for User to Logout" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  //const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  //const { supabase } = createClientSPA();
  const { error } = await supabase.auth.signOut();
  //console.log("garry error ", error);

  if (!error) return redirect(`/login`);
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Account Logout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Card className=" mx-5 md:mx-20 my-auto">
        <CardHeader>
          <CardTitle className=" flex flex-row gap-3">
            <LogOut />
            Logout
          </CardTitle>
          <CardDescription>Sign out account</CardDescription>
          <CardAction></CardAction>
        </CardHeader>
        <CardContent className=" bg-gray-900/30 py-10 m-2">
          <div className="mx-auto">
            <h1>Are you sure you want to Sign Out?</h1>
            <Form method="post" encType="multipart/form-data" className="flex flex-col">
              <div>
                <button
                  className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-red-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                  type="submit"
                >
                  <SquareArrowRightExit />
                  Yes, logout
                </button>
              </div>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <p></p>
        </CardFooter>
      </Card>
    </>
  );
}
