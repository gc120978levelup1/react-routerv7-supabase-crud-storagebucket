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
import { PencilLine, Save } from "lucide-react";

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
import type { Route } from "./+types/edit";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import {supabase, headers} from "../lib/supabase-js"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Edit Item" },
    { name: "description", content: "Edit 1 item from Table1" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
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
  const { error } = await supabase
    .from("table1")
    .update({ name, age })
    .eq("id", params.id);
  return redirect(`/show/${params.id}`);
}

export default function Edit({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Table 1 - Edit Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Form
              method="post"
              encType="multipart/form-data"
              className="flex flex-col"
            >
              <Card className=" mx-5 md:mx-20 my-auto">
                <CardHeader>
                  <CardTitle className=" flex flex-row gap-3">
                    <PencilLine />
                    Edit Item
                  </CardTitle>
                  <CardDescription>Edit item on Table 1</CardDescription>
                  <CardAction></CardAction>
                </CardHeader>
                <CardContent className=" bg-gray-900/30 py-10 m-2">
                  <div className="mx-auto gap-6 flex flex-row">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name">name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={todo.name}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="age">age</Label>
                      <Input
                        type="number"
                        name="age"
                        id="age"
                        defaultValue={todo.age}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <h1>Do you want to save the changes to this Item?</h1>
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
          </li>
        ))}
      </ul>
    </>
  );
}
