// this specific page component import
// specific component import
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
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
import { ListPlus, Eye, ListX } from "lucide-react";
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
import type { Route } from "./+types/personnel_data_update";
import { createClientSPA } from "../lib/supabase.client.spa";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Duty Status Update" },
    { name: "description", content: "Personnel Duty Status Update" },
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
  } = await supabase
    .from("crews")
    .select("*", { count: "exact" })
    .eq("email", user.email);
  //console.log("garry error count", count);
  //console.log("garry error error", error);
  return { todos, count, user };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const status = formData.get("status") as string;
  const { supabase } = createClientSPA();
  const { data, error } = await supabase
    .from("crews")
    .upsert(
      {
        email: email,
        status: status,
      },
      { onConflict: "email" },
    )
    .select();

  // save changes in user duty status to local storage
  if (!error) {
    const settings = {
      email: email,
      status: status,
    };
    localStorage.setItem("userDutyStatus1234567890", JSON.stringify(settings));
  }

  if (!error) return redirect(`/`);
}

export default function PersonnelDataUpdate({
  loaderData,
}: Route.ComponentProps) {
  const frameworks = ["onduty", "offduty", "office", "onleave"];
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Personnel Duty Status Update</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {loaderData.count == 0 && (
        <div>
          <h1></h1>
          <div>
            <h1 className="flex flex-row">
              <p className=" ml-30 mr-auto w-fit text-red-500 animate-pulse">
                Personnel Data Not Yet Updated. Please update it.{" "}
              </p>
              <a
                className=" flex flex-row gap-2 ml-auto mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                href={`/personnel_data_update`}
              >
                <ListPlus />
                Update Personnel Data
              </a>
            </h1>
          </div>
        </div>
      )}
      <ul className=" flex flex-col">
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <div>
              <Form
                method="post"
                encType="multipart/form-data"
                className="flex flex-col"
              >
                <Card className=" mx-5 md:mx-20 my-auto">
                  <CardHeader>
                    <CardTitle className=" flex flex-row gap-3">
                      <PencilLine />
                      Update My Personnel Duty Status
                    </CardTitle>
                    <CardDescription>
                      Update item on crews table
                    </CardDescription>
                    <CardAction></CardAction>
                  </CardHeader>
                  <CardContent className=" bg-gray-900/30 py-10 m-2">
                    <div className="mx-auto gap-6 flex flex-row flex-wrap">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">email</Label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          defaultValue={todo.email}
                          readOnly
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="status">Duty Status</Label>
                        <Combobox
                          items={frameworks}
                          name="status"
                          id="status"
                          defaultValue={todo.status}
                        >
                          <ComboboxInput placeholder="Select a duty status" />
                          <ComboboxContent>
                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item} value={item}>
                                  {item}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
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
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
