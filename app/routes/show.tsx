// this specific page component import
// specific component import
import { Label } from "~/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Eye, PencilLine, ListX } from "lucide-react";

// usual component import
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { SidebarTrigger } from "~/components/ui/sidebar";

// rrv7 import
import type { Route } from "./+types/show";
//import { createClientSPA } from "../lib/supabase.client.spa";
import { supabase, headers } from "../lib/supabase-js";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Show Item" },
    { name: "description", content: "Shows 1 item from Table1" },
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
  const { data: todos } = await supabase
    .from("table1")
    .select("*")
    .eq("id", params.id);
  return { todos };
}

export default function Show({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Table 1 - Show Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Card className=" mx-5 md:mx-20 my-auto">
              <CardHeader>
                <CardTitle className=" flex flex-row gap-3">
                  <Eye />
                  Show Item
                </CardTitle>
                <CardDescription>Show item on Table 1</CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent className=" bg-gray-900/30 py-10 m-2">
                <div className="mx-auto gap-6 flex flex-row">
                  <div>
                    <Label htmlFor="name">name</Label>
                    <p className=" font-extrabold text-lg">{todo.name}</p>
                  </div>
                  <div>
                    <Label htmlFor="name">age</Label>
                    <p className=" font-extrabold text-lg">{todo.age}</p>
                  </div>
                  <p>
                    {" "}
                    <a href=""></a>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <h1>Do you want to make some changes to this Item?</h1>
                <div className=" ml-auto gap-6 flex flex-row">
                  <a
                    className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                    href={`/edit/${todo.id}`}
                  >
                    <PencilLine />
                    Yes, Edit
                  </a>
                  <a
                    className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-red-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                    href={`/delete/${todo.id}`}
                  >
                    <ListX />
                    Please, Delete
                  </a>
                </div>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
