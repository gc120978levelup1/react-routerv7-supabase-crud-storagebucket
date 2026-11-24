import { description } from "~/components/chart-area-interactive";
import { supabase } from "~/lib/supabase-js";
const tableName: string = "crews";

const crew_index = async () => {
    const todos = await supabase.from(tableName).select();
    return todos.data;
}

const crew_index_i = async (id: any) => {
    const todos = await supabase.from(tableName).select().eq("id", id);
    return todos.data;
}

const crew_index_email = async (email: any) => {
    const todos = await supabase.from(tableName).select().eq("email", email);
    return todos.data;
}

const crew_index_on_duty = async () => {
    const todos = await supabase.from(tableName).select().eq("status", "onduty");
    return todos.data;
}

const crew_create = async (payLoadData: Object) => {
    const todos = (await supabase.from(tableName).insert(payLoadData).select());
    //console.log("garry error error = ", todos);
    return todos.data;
}

const crew_edit = async (id: any, payLoadData: Object) => {
    const todos = await supabase
        .from(tableName)
        .update(payLoadData)
        .eq("id", id)
        .select();
    //console.log("garry error error = ", todos);
    return todos.data;
}

const crew_upsert = async (payLoadData: Object) => {
    const todos = await supabase
        .from(tableName)
        .upsert(payLoadData,
            { onConflict: "email" },
        )
        .select();
    //console.log("garry error error = ", todos);
    return todos.data;
}

const crew_delete = async (id: any) => {
    const todos = await supabase.from(tableName).delete().eq("id", id).select();
    //console.log("garry error todos =",todos)
    return todos.data;
}

export {
    crew_index,
    crew_index_i,
    crew_index_email,
    crew_index_on_duty,
    crew_create,
    crew_upsert,
    crew_edit,
    crew_delete
}