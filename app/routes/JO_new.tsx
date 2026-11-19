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
import { Textarea } from "~/components/ui/textarea";
import { ListPlus, Save } from "lucide-react";

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
import type { Route } from "./+types/JO_new";
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
  const nearAccountNumber = formData.get("nearAccountNumber") as string;
  const description = formData.get("description") as string;
  const status = "new";
  const dateNew = new Date();
  //const dateNew = now.toString();
  const { supabase } = createClientSPA();
  const { error, data: todos } = await supabase
    .from("jobs")
    .insert({ nearAccountNumber, description, status, dateNew })
    .select("id")
    .single();
  if (!error) {
    return redirect(`/JO_show/${todos.id}`);
  }
}

export default function JONew() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>jobs - Add Item</BreadcrumbPage>
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
              <ListPlus />
              Create New JO
            </CardTitle>
            <CardDescription>Insert new item on jobs</CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent className=" bg-gray-900/30 py-10 m-2">
            <div className="mx-10 gap-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nearAccountNumber">nearAccountNumber</Label>
                <Input
                  type="text"
                  name="nearAccountNumber"
                  id="nearAccountNumber"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">description</Label>
                <Textarea
                  className=" grow mt-2 text-2xl h-50"
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <h1>Are you sure you want to Save Item?</h1>
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
