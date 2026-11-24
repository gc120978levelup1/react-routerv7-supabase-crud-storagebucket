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
import { Trash, PencilLine, ListX } from "lucide-react";

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
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import type { Route } from "./+types/delete";
import { createClientSPA } from "../lib/supabase.client.spa";
import { authGuard } from "~/auth/Login";
import { supabase } from "~/lib/supabase-js";
import { job_delete, job_index_i } from "~/models/Jobs";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Delete Item" },
    { name: "description", content: "Delete 1 item from Table1" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const todos = await job_index_i(params!.id);
  return { todos, count:1 };
}

export async function clientAction({ params }: ActionFunctionArgs) {
  
  const todos = await job_delete (params.id);
  return redirect(`/JO_master`);
}

export default function JODelete({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Table 1 - Delete Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul>
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Form method="post" className="flex flex-col">
              <Card className=" mx-5 md:mx-20 my-auto">
                <CardHeader>
                  <CardTitle className=" flex flex-row gap-3">
                    <Trash />
                    Delete Item
                  </CardTitle>
                  <CardDescription>Delete item on Table 1</CardDescription>
                  <CardAction></CardAction>
                </CardHeader>
                <CardContent className=" bg-gray-900/30 py-10 m-2">
                  <div className="mx-auto gap-6 flex flex-row">
                    <div>
                      <Label htmlFor="nearAccountNumber">nearAccountNumber</Label>
                      <p className=" font-extrabold text-lg">{todo.nearAccountNumber}</p>
                    </div>
                    <div>
                      <Label htmlFor="description">description</Label>
                      <p className=" font-extrabold text-lg">{todo.description}</p>
                    </div>
                    <p>
                      {" "}
                      <a href=""></a>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <h1>Do you confirm to delete this Item?</h1>
                  <div className=" ml-auto gap-6 flex flex-row">
                    <a
                      className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                      href={`/edit/${todo.id}`}
                    >
                      <PencilLine />
                      No! No!, Edit Only
                    </a>
                    <button
                      className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-red-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                      type="submit"
                    >
                      <ListX />
                      Confirm, Delete
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
