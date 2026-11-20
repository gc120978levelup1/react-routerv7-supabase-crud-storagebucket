// components/visual controls
import { Button } from "@base-ui/react";

// basic rrv7 imports
import type { Route } from "../+types/show"; // <--- show should be changed by the name of the file. file should follows "object_verb_closure" convention
import { useEffect, useRef, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase-js";

export function meta({}: Route.MetaArgs) {
  return [
    // set page title that can be seen in browser tab
    { title: "Table1 Master List" },
    { name: "description", content: "Lists of Table 1 data" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  //on_load_page
  // middleware to guard route from unauthorized entry
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  // main query code starts below
  const { data: todos, error } = await supabase.from("table1").select(); // maybe apply some params here like eq, gt, lt
  return { todos, error }; // throw data to local mainPageRenderer -> loaderData
}

export default function mainPageRenderer({ params, loaderData }: Route.ComponentProps) {
  // example state declaration
  // to update status into the DOM
  const [value, setValue] = useState(0);

  // example of reference declaration
  const refValue = useRef(null);

  // use to programmatically go back 
  const navigate = useNavigate();
  const page_back = () => {
    navigate(-1);
  }

  useEffect(() => {
    // where to declare setInterval, setTimeout, navigator.geolocation.getCurrentPosition
    // do initialization that needs DOM to be already mounted

    return () => {
      // do destruction before closing page
    };
  }, []);

  // render page or use redirect to call other page
  return (
    <>
      <Button onClick={page_back}>Back</Button>
      <NavLink to={`/add`}>edit</NavLink>
      {loaderData.todos?.map((todo, index) => (
        <div key={index}>
          <div>
            {todo.id} {todo.name} {todo.age}
          </div>
          <NavLink to={`/show/${todo.id}`}>edit</NavLink>
        </div>
      ))}
    </>
  );
}
