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
import type { Route } from "./+types/JO_add_before_picture1";
import {
  Form,
  useActionData,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { createClientSPA } from "../lib/supabase.client.spa";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Avatar" },
    { name: "description", content: "Page for User to Upload Avatar picture" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  
  // main query code
  return { joId: params.id };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("picture");
  if (!(file instanceof File) || file.size === 0) {
    console.log("garry error file", file);
    console.log("garry error", "Please select a valid image file.");
    return { error: "Please select a valid image file." };
  }
  // Get the authenticated user so uploads go into that user's folder.
  const { supabase } = createClientSPA();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Sign in before uploading.");

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : "bin";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  //const path = `${user.id}/avatar`;
  console.log("garry error path", path);

  // 1. Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("images") // Replace with your bucket name
    .upload(path, file, {
      cacheControl: "0",
      upsert: true,
      contentType: file.type, // Explicitly set content type
    });

  console.log("garry error", uploadError);

  // 2. Retrieve the public URL (for public buckets)
  const { data } = supabase.storage.from("images").getPublicUrl(path);

  console.log("garry error data", data);
  // save changes in user settings to local storage
  if (true) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error(userError.message);
      return;
    }
    if (!user) {
      return;
    }
    //const path = `${user.id}/avatar`;
    const { data } = supabase.storage.from("images").getPublicUrl(path);

    //save public url to jobs table
    const { error } = await supabase
      .from("jobs")
      .update({ beforepicture1: data.publicUrl })
      .eq("id", params.id);
  }
  return { publicUrl: data.publicUrl };
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
                  Job Order - Before Picture 1
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
            href="javascript:history.back()"
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
              Upload Before Picture 1
            </CardTitle>
            <CardDescription>
              Photo upload
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
            <h1>Do you want to upload the changes to your Before Picture 1</h1>
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
