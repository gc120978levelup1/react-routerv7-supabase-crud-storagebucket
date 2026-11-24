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
import { UserRoundStar, Save } from "lucide-react";

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
import type { Route } from "./+types/avat_picture";
import {
  Form,
  useActionData,
  type ActionFunctionArgs,
  redirect,
} from "react-router";

import { storageUploadImage } from "~/models/StorageImages";
import { authGuard, userAuthGet } from "~/auth/Login";
import { set_store_value, user_settings } from "~/lib/globalVar";

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

  const user = await userAuthGet()
  // main query code
  return { user };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("picture");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a valid image file." };
  }
  const user = await userAuthGet();
  const path = `${user?.id}/avatar`;
  const data = await storageUploadImage(file, path);
  set_store_value(user_settings, {
    name: user?.user_metadata?.display_name,
    email: user?.email,
    avatar: data?.publicUrl,
  });
  window.location.reload();
  return { publicUrl: data?.publicUrl };
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
                  My Account - Change User Avatar, User Email:{" "}
                  <span className=" p-2 bg-blue-950 font-extrabold">
                    {loaderData.user.email}
                  </span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <Card className=" mx-5 md:mx-20 my-auto">
          <CardHeader>
            <CardTitle className=" flex flex-row gap-3">
              <UserRoundStar />
              Edit Display Avatar
            </CardTitle>
            <CardDescription>
              Edit User: {loaderData.user.email} Display Avatar
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardContent className=" bg-gray-900/30 py-10 m-2">
            <div className="mx-auto gap-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label htmlFor="picture">User Avatar Picture</Label>
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
            <h1>Do you want to upload the changes to your Avatar Picture?</h1>
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
