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
import type { Route } from "./+types/crew_master_list";
import { createClientSPA } from "../lib/supabase.client.spa";
import { redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "crews Master List" },
    { name: "description", content: "crews Master List" },
  ];
}
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  //on_load_page
  // middleware to guard route from unauthorized entry
  const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code
  const { data: todos } = await supabase.from("crews").select();
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
                <BreadcrumbPage>crews Master List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <h1 className="flex flex-row">
        <p className=" ml-30 mr-auto w-fit">Crews Masterlist</p>
      </h1>
      <main className=" mt-2 px-auto md:px-30">
        <Table className=" border-2">
          <TableHeader className=" text-lg font-extrabold bg-amber-950">
            <TableRow>
              <TableHead className="font-medium">displayname</TableHead>
              <TableHead>callsign</TableHead>
              <TableHead>crewType</TableHead>
              <TableHead className="text-right">mobilenumber</TableHead>
              <TableHead className="">status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loaderData.todos?.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">
                  {todo.displayname}
                </TableCell>
                <TableCell>{todo.callsign}</TableCell>
                <TableCell>{todo.crewType}</TableCell>
                <TableCell className="text-right">
                  {todo.mobilenumber}
                </TableCell>
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
                        <a
                          className="w-full"
                          href={`crew_plot_on_map/${todo.id}`}
                        >
                          show in map
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          className="w-full"
                          href={`crew_show_data/${todo.id}`}
                        >
                          show data
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <a className="w-full" href={`delete/${todo.id}`}>
                          show assigned jobs
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
