import type { Route } from "./+types/avat_picture";
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
  const { supabase, headers } = createClientSPA();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // main query code
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
  //const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const path = `${user.id}/avatar`;
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
  return { publicUrl: data.publicUrl };
}

export default function AvatPicture({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof clientAction>();
  return (
    <>
      <h1>New Avatar Image</h1>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col"
      >
        <div className="flex flex-row gap-2">
          <label htmlFor="name">picture</label>
          <input type="file" name="picture" id="picture" accept="image/*" />
        </div>
        <div>
          <button
            className=" mt-2 rounded-lg border-2 p-2 hover:text-blue-800 hover:bg-amber-200 hover:cursor-pointer"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
      <br />
      {actionData?.publicUrl && (
        <div style={{ marginTop: "1.5rem" }}>
          <p>Uploaded successfully!</p>
        </div>
      )}
    </>
  );
}
