// this specific page component import
// specific component import
// this specific page component import
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/JO_assign_crew";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
import { authGuard } from "~/auth/Login";
import type { supabase } from "~/lib/supabase-js";
import { job_index_i } from "~/models/Jobs";
import { crew_index_on_duty } from "~/models/Crews";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const todos = await job_index_i(params.id);
  const todos2 = await crew_index_on_duty();
  const joId = todos![0].id;
  return { todos, todos2, joId};
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  const scrollhereRef = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{
    scrollhereRef.current?.scrollIntoView({ behavior: "smooth" });
  })
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Job Order - Assign A Crew</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul className=" flex flex-col">
        <div>
          <h1 className="flex flex-row">
            <p className=" ml-30 mr-auto w-fit">Job Order Data</p>
            <a
              className=" flex flex-row gap-2 ml-auto mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
              href={`/JO_show/${loaderData.joId}`}
            >
              <ListPlus />
              Back to Main Job Order Interface
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
                    <Label htmlFor="nearAccountNumber">nearAccountNumber</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.nearAccountNumber}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="dateNew">dateNew</Label>
                    <p className=" font-extrabold text-lg">{todo.dateNew}</p>
                  </div>
                  <div>
                    <Label htmlFor="status">status</Label>
                    <p className=" font-extrabold text-lg">{todo.status}</p>
                  </div>
                  <div>
                    <Label htmlFor="crewId">crewId</Label>
                    <p className=" font-extrabold text-lg">{todo.crewId}</p>
                  </div>
                  <div>
                    <Label htmlFor="dateAssigned">dateAssigned</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.dateAssigned}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="description">description</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.description}
                    </p>
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="beforepicture1">
                      beforepicture1
                    </Label>
                    <img
                      src={todo.beforepicture1}
                      width={180}
                      alt="beforepicture1"
                    />
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="beforepicture2">
                      beforepicture2
                    </Label>
                    <img
                      src={todo.beforepicture2}
                      width={180}
                      alt="beforepicture2"
                    />
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
      <br />
      <h1 className="flex flex-row">
        <p ref={scrollhereRef}  className=" ml-30 mr-auto w-fit">
          Select Working Crews from this Masterlist
        </p>
      </h1>
      <main className=" mt-2 px-auto md:px-30">
        <Table className=" border-2">
          <TableHeader className=" text-lg font-extrabold bg-amber-950">
            <TableHead className="font-medium">displayname</TableHead>
            <TableHead>callsign</TableHead>
            <TableHead>crewType</TableHead>
            <TableHead className="text-right">mobilenumber</TableHead>
            <TableHead className="">status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {loaderData.todos2!.map((todo1) => (
              <TableRow>
                <TableCell className="font-medium">
                  {todo1.displayname}
                </TableCell>
                <TableCell>{todo1.callsign}</TableCell>
                <TableCell>{todo1.crewType}</TableCell>
                <TableCell className="text-right">
                  {todo1.mobilenumber}
                </TableCell>
                <TableCell>{todo1.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`/crew_plot_on_map/${todo1.id}`}
                        >
                          show in map
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`/crew_show_data/${todo1.id}`}
                        >
                          show data
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <a
                          className="w-full"
                          href={`/JO_assign_crew_select/${loaderData.joId}/crew/${todo1.id}`}
                        >
                          assign job to crew
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
      <br />
      <br />
    </>
  );
}
