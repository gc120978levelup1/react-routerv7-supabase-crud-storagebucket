

//import { data, redirect, type ActionFunctionArgs } from "react-router";
import { supabase } from "~/lib/supabase-js";
const tableName:string = "jobs";

const job_index = async () => {
    const todos = await supabase.from(tableName).select();
    return todos.data;
}

const job_index_i = async (id: any) => {
    const todos = await supabase.from(tableName).select().eq("id", id);
    //console.log("garry error error = ", todos);
    return todos.data;
}

const job_create = async (payLoadData: Object) => {
    const todos = (await supabase.from(tableName).insert(payLoadData).select());
    //console.log("garry error error = ", todos);
    return todos.data;
}

const job_edit = async (id: any, payLoadData: Object) => {
    const todos = await supabase
        .from(tableName)
        .update(payLoadData)
        .eq("id", id)
        .select();
    //console.log("garry error error = ", todos);
    return todos.data;
}

const job_delete = async (id: any) => {
  const todos = await supabase.from(tableName).delete().eq("id", id).select();
  //console.log("garry error todos =",todos)
  return todos.data;
}

export { 
    job_index, 
    job_index_i, 
    job_create, 
    job_edit, 
    job_delete 
}