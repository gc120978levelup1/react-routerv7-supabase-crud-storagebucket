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
import { Form, type ActionFunctionArgs, redirect } from "react-router";
import { userAuthGet } from "~/auth/Login";
import { crew_index_email, crew_upsert } from "~/models/Crews";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data Update" },
    { name: "description", content: "Personnel Data Update" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const user =  await userAuthGet();
  if (!user) return redirect("/login");

  // main query code
  const todos = await crew_index_email(user.email);
  const count = (todos ? 1 : 0);
  return { todos, count, user };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const allData = Object.fromEntries(formData);
  const todos = await crew_upsert(allData);
  if (todos) return redirect(`/personnel_data`);
}

export default function PersonnelDataUpdate({
  loaderData,
}: Route.ComponentProps) {
  const frameworks = ["crew", "communication", "supervisor", "personnel"];
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
      {loaderData.count == 0 && (
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
                  Edit Personnel Data
                </CardTitle>
                <CardDescription>Edit item on crews table</CardDescription>
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
                      defaultValue={loaderData.user.email}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="displayname">display name</Label>
                    <Input
                      type="text"
                      name="displayname"
                      id="displayname"
                      defaultValue={loaderData.user.user_metadata?.display_name}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="call sign">callsign</Label>
                    <Input
                      type="text"
                      name="callsign"
                      id="callsign"
                      defaultValue=""
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="mobilenumber">mobile number</Label>
                    <Input
                      type="tel"
                      name="mobilenumber"
                      id="mobilenumber"
                      defaultValue={0}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description">description</Label>
                    <Input
                      type="text"
                      name="description"
                      id="description"
                      defaultValue="blank"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="crewType">crew Type</Label>
                    <Combobox items={frameworks} name="crewType" id="crewType">
                      <ComboboxInput placeholder="Select a crew type" />
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
                      Edit Personnel Data
                    </CardTitle>
                    <CardDescription>Edit item on crews table</CardDescription>
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
                        <Label htmlFor="displayname">display name</Label>
                        <Input
                          type="text"
                          name="displayname"
                          id="displayname"
                          defaultValue={todo.displayname}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="call sign">callsign</Label>
                        <Input
                          type="text"
                          name="callsign"
                          id="callsign"
                          defaultValue={todo.callsign}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="mobilenumber">mobile number</Label>
                        <Input
                          type="tel"
                          name="mobilenumber"
                          id="mobilenumber"
                          defaultValue={todo.mobilenumber}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="description">description</Label>
                        <Input
                          type="text"
                          name="description"
                          id="description"
                          defaultValue={todo.description}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="crewType">crew Type</Label>
                        <Combobox
                          items={frameworks}
                          name="crewType"
                          id="crewType"
                          defaultValue={todo.crewType}
                        >
                          <ComboboxInput placeholder="Select a crew type" />
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
