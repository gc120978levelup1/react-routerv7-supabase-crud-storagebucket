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
import { Camera, Save, ListPlus } from "lucide-react";

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
import type { Route } from "./+types/JO_add_before_picture2";
import {
  Form,
  useActionData,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
import { authGuard, userAuthGet } from "~/auth/Login";
import { job_edit } from "~/models/Jobs";
import { storageUploadImage } from "~/models/StorageImages";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Avatar" },
    { name: "description", content: "Page for User to Upload Avatar picture" },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const user = await userAuthGet();
  return { user, joId: params.id };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("picture");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a valid image file." };
  }
  // Get the authenticated user so uploads go into that user's folder.
  const user = await userAuthGet();
  if (!user) throw new Error("Sign in before uploading.");

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : "bin";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  //const path = `${user.id}/avatar`;
  console.log("garry error path = ", path);

  // 1. Upload the file to Supabase Storage
  const todos = await storageUploadImage(file, path);

  //save public url to jobs table
  const todos2 = await job_edit(params.id, {
    beforepicture2: todos.publicUrl,
  });

  return { publicUrl: todos.publicUrl };
}

export default function AvatPicture({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof clientAction>();
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  Job Order - Before Picture 2
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <br />
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
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <Card className=" mx-5 md:mx-20 my-auto">
          <CardHeader>
            <CardTitle className=" flex flex-row gap-3">
              <Camera />
              Edit Display Avatar
            </CardTitle>
            <CardDescription>
              Photo Upload
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent className=" bg-gray-900/30 py-10 m-2">
            <div className="mx-auto gap-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label htmlFor="picture">Upload Picture</Label>
                <Input
                  type="file"
                  name="picture"
                  id="picture"
                  accept="image/*"
                />
              </div>
              <br />
              {actionData?.publicUrl && (
                <div style={{ marginTop: "1.5rem" }}>
                  <p>Uploaded successfully!</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <h1>Do you want to upload the changes to your Before Picture 2</h1>
            <div className=" ml-auto">
              <button
                className=" flex flex-row gap-2 mx-auto my-3 rounded-lg border-2 p-3 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                type="submit"
              >
                <Save />
                Yes, Upload
              </button>
            </div>
          </CardFooter>
        </Card>
      </Form>
    </>
  );
}
