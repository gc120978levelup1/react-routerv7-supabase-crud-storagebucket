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
import { ListPlus, Eye, PencilLine, ListX } from "lucide-react";

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
import type { Route } from "./+types/personnel_data";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
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
  const {
    data: todos,
    count,
    error,
  } = await supabase.from("crews").select("*").eq("email", user.email);
  return { todos, count };
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Personnel Data - Show Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul className=" flex flex-col">
        <div>
          <h1 className="flex flex-row">
            <p className=" ml-30 mr-auto w-fit">My Personnel Data</p>
            <a
              className=" flex flex-row gap-2 ml-auto mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
              href={`/personnel_data_update`}
            >
              <ListPlus />
              Update Personnel Data
            </a>
          </h1>
        </div>
        <br />
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Card className=" mx-5 md:mx-20 my-auto">
              <CardHeader>
                <CardTitle className=" flex flex-row gap-3">
                  <Eye />
                  Show Item
                </CardTitle>
                <CardDescription>Show item on crews table</CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent className=" bg-gray-900/30 py-10 m-2">
                <div className="mx-auto gap-6 flex flex-row flex-wrap">
                  <div>
                    <Label htmlFor="email">email</Label>
                    <p className=" font-extrabold text-lg">{todo.email}</p>
                  </div>
                  <div>
                    <Label htmlFor="displayname">displayname</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.displayname}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="callsign">callsign</Label>
                    <p className=" font-extrabold text-lg">{todo.callsign}</p>
                  </div>
                  <div>
                    <Label htmlFor="mobilenumber">mobilenumber</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.mobilenumber}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="description">description</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.description}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="crewType">crewType</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.crewType}
                    </p>
                  </div>
                  <p>
                    {" "}
                    <a href=""></a>
                  </p>
                </div>
              </CardContent>

            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
