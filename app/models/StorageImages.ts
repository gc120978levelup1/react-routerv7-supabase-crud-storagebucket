
import { supabase } from "~/lib/supabase-js";
const storageBucketName = "images"

const storageUploadImage = async (file: File, path: string) => {
    // 1. Upload the file to Supabase Storage
    const todos = await supabase.storage
        .from(storageBucketName) // Replace with your bucket name
        .upload(path, file, {
            cacheControl: "0",
            upsert: true,
            contentType: file.type, // Explicitly set content type
        });
    //console.log("garry error todos = ", todos)
    const todos2 = supabase.storage.from(storageBucketName).getPublicUrl(todos?.data?.path!)
    return todos2.data;
}

const storageGetPublicUrl = (path: string) => {
    const urlRes = supabase.storage.from("images").getPublicUrl(path);
    return urlRes.data
}

export {
    storageUploadImage,
    storageGetPublicUrl,
}