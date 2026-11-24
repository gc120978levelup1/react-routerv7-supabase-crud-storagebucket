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
import type { Route } from "./+types/_index";

import { redirect } from "react-router";
import { authGuard } from "~/auth/Login";
import { job_index } from "~/models/Jobs";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Table1 Master List" },
    { name: "description", content: "Lists of Table 1 data" },
  ];
}
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const todos = await job_index();
  return { todos };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Job Order - Master List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <h1 className="flex flex-row">
        <p className=" ml-30 mr-auto w-fit">Items Masterlist</p>
        <a
          className=" flex flex-row gap-2 ml-auto mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
          href={`/JO_new`}
        >
          <ListPlus />
          Add
        </a>
      </h1>
      <main className=" mt-2 px-auto md:px-30">
        <Table className=" border-2">
          <TableHeader className=" text-lg font-extrabold bg-amber-950">
            <TableRow>
              <TableHead className="font-medium text-right">ID</TableHead>
              <TableHead>nearAccountNumber</TableHead>
              <TableHead>description</TableHead>
              <TableHead>crewId</TableHead>
              <TableHead>status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loaderData.todos?.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium text-right">
                  {todo.id}
                </TableCell>
                <TableCell>{todo.nearAccountNumber}</TableCell>
                <TableCell>
                  <Textarea value={todo.description} readOnly />
                </TableCell>
                <TableCell>{todo.crewId}</TableCell>
                <TableCell>{todo.status}</TableCell>
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
                        <a className="w-full" href={`JO_show/${todo.id}`}>
                          Show
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`JO_add_before_picture1/${todo.id}`}
                        >
                          Add Before Picture 1
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`JO_add_before_picture2/${todo.id}`}
                        >
                          Add Before Picture 2
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`JO_assign_gis_tagging/${todo.id}`}
                        >
                          Assign GIS Tagging
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`JO_assign_crew/${todo.id}`}
                        >
                          Assign Working Crew
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`JO_crew_accept/${todo.id}`}
                        >
                          Acceept Assignment
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <a className="w-full" href={`JO_delete/${todo.id}`}>
                          delete
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
    </>
  );
}
