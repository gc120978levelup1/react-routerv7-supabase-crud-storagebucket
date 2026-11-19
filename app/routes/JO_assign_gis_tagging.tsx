// leaflet imports
import { useEffect, useRef, useState } from "react";
import { Map as LeafletMap, TileLayer, Marker } from "leaflet";
import "leaflet/styles.css";

// this specific page component import
// specific component import
// this specific page component import
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

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
import { ListPlus, Eye, PencilLine, ListX } from "lucide-react";

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
import type { Route } from "./+types/JO_assign_gis_tagging";
import { createClientSPA } from "../lib/supabase.client.spa";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
//import type { Input } from "@base-ui/react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
  ];
}
export async function clientLoader({ params }: Route.LoaderArgs) {
  // middleware to guard route from unauthorized entry
  const { supabase, headers } = createClientSPA();
  // donot need login
  /*
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  */
  // main query code
  const {
    data: todos,
    //count,
    error,
  } = await supabase.from("jobs").select("*").eq("id", params.id);
  const joId = todos![0].id;
  return { todos, joId };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const xlon = formData.get("xlon") as string;
  const ylat = formData.get("ylat") as string;
  const { supabase } = createClientSPA();
  const { error } = await supabase
    .from("jobs")
    .update({ xlon, ylat })
    .eq("id", params.id);
  return redirect(`/JO_show/${params.id}`);
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const refLat = useRef<HTMLInputElement | null>(null);
  const refLon = useRef<HTMLInputElement | null>(null);
  const [JOLat, setJOLat] = useState(0.0);
  const [JOLon, setJOLon] = useState(0.0);
  const scrollhereRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // retreive GPS JSON data from local storage
    const settings = JSON.parse(
      localStorage.getItem("gpsSettings56867e534646")!,
    );
    if (loaderData.todos![0].xlon > 0 && loaderData.todos![0].ylat > 0) {
      settings.latitude = loaderData.todos![0].ylat;
      settings.longitude = loaderData.todos![0].xlon;
    }
    // ensure that Leaflet map initialization should be done once
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new LeafletMap(mapContainerRef.current).setView(
      [settings.latitude, settings.longitude],
      18,
    );
    mapInstanceRef.current.getContainer().style.cursor = "pointer";
    mapInstanceRef.current.doubleClickZoom.disable();
    new TileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 22,
      attribution:
        '&copy; <a href="https://www.google.com/maps/search/">Google Hybrid Map</a>',
    }).addTo(mapInstanceRef.current);

    // Listen for map clicks
    const JOMarker = new Marker([settings.latitude, settings.longitude], {
      alt: `JO Marker`,
    })
      .addTo(mapInstanceRef.current!)
      .bindPopup(
        `
              <div class=" flex flex-col w-full m-0">
                <div class=" mt-1">marker</div>
                <div class=" text-md font-extrabold">${"JO Marker"}</div>
              </div>
              `,
      )
      .bindTooltip("This is My Locaion!", {
        permanent: true,
        direction: "top",
      });
    setJOLat(settings.latitude);
    setJOLon(settings.longitude);
    refLat.current!.value = settings.latitude;
    refLon.current!.value = settings.longitude;
    mapInstanceRef.current.on("dblclick", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      console.log(`Clicked at: ${lat}, ${lng}`);
      JOMarker.setLatLng([lat, lng]);
      setJOLat(lat);
      setJOLon(lng);
      refLat.current!.value = lat.toString();
      refLon.current!.value = lng.toString();
    });

    const { supabase } = createClientSPA();
    supabase
      .from("crews")
      .select()
      .then(({ data: todos }) => {
        console.log("garry error todos", todos);
        todos?.forEach((todo, index) => {
          const marker = new Marker([todo.ylat, todo.xlon], {
            alt: todo.callsign,
          }).addTo(mapInstanceRef.current!).bindPopup(`
              <div class=" flex flex-col w-full m-0">
                <div class=" mt-1">callsign</div>
                <div class=" text-md font-extrabold">${todo.callsign}</div>
                <div class=" mt-1">email</div>
                <div class=" text-md font-extrabold">${todo.email}</div>
                <div class=" mt-1">displayname</div>
                <div class=" text-md font-extrabold">${todo.displayname}</div>
                <div class=" mt-1">mobilenumber</div>
                <div class=" text-md font-extrabold">${todo.mobilenumber}</div>
                <div class=" mt-1">crewType</div>
                <div class=" text-md font-extrabold">${todo.crewType}</div>
                <div class=" mt-1">status</div>
                <div class=" text-md font-extrabold">${todo.status}</div>
                <div class=" mt-1">description</div>
                <div class=" text-md font-extrabold">${todo.description}</div>
              </div>
              `);
        });
      });
    scrollhereRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Job Order - Assign GIS Geo Tag</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul className=" flex flex-col">
        <div>
          <h1 className="flex flex-row">
            <p className=" ml-0 md:ml-30 mr-auto w-fit">Job Order Data</p>
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
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <Card className=" mx-5 md:mx-20 my-auto">
              <CardHeader>
                <CardTitle className=" flex flex-row gap-3">
                  <Eye />
                  Show Item
                </CardTitle>
                <CardDescription>Show item on crews table</CardDescription>
                <CardAction></CardAction>
              </CardHeader>
              <CardContent className=" bg-gray-900/30 py-10 m-2">
                <div className="mx-auto gap-6 flex flex-row flex-wrap">
                  <div>
                    <Label htmlFor="nearAccountNumber">nearAccountNumber</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.nearAccountNumber}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="dateNew">dateNew</Label>
                    <p className=" font-extrabold text-lg">{todo.dateNew}</p>
                  </div>
                  <div>
                    <Label htmlFor="status">status</Label>
                    <p className=" font-extrabold text-lg">{todo.status}</p>
                  </div>
                  <div>
                    <Label htmlFor="crewId">crewId</Label>
                    <p className=" font-extrabold text-lg">{todo.crewId}</p>
                  </div>
                  <div>
                    <Label htmlFor="dateAssigned">dateAssigned</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.dateAssigned}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="description">description</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.description}
                    </p>
                  </div>
                  <div>
                    <a
                      className=" flex flex-row gap-2 ml-2 md:ml-auto mr-3 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                      href={`/JO_add_before_picture1/${todo.id}`}
                    >
                      <ListPlus />
                      add a photo
                    </a>

                    <Label className="mb-2" htmlFor="beforepicture1">
                      beforepicture2
                    </Label>
                    <img
                      src={todo.beforepicture1}
                      width={180}
                      alt="beforepicture1"
                    />
                  </div>
                  <div>
                    <a
                      className=" flex flex-row gap-2 ml-2 md:ml-auto mr-3 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                      href={`/JO_add_before_picture2/${todo.id}`}
                    >
                      <ListPlus />
                      add a photo
                    </a>
                    <Label className="mb-2" htmlFor="beforepicture2">
                      beforepicture2
                    </Label>
                    <img
                      src={todo.beforepicture2}
                      width={180}
                      alt="beforepicture2"
                    />
                  </div>
                  <p>
                    {" "}
                    <a href=""></a>
                  </p>
                </div>
              </CardContent>
            </Card>
            <br />
            <h1 className="flex flex-row">
              <p ref={scrollhereRef} className=" md:ml-30 mx-auto w-fit">
                Double Click on the map to assign location and click submit
                button
              </p>
            </h1>
            <div className="flex flex-1 flex-col gap-4 p-1 pt-0">
              <div
                ref={mapContainerRef}
                className="relative  w-full h-[70vh] md:h-[75vh] md:w-[90%] md:mx-auto mt-2 rounded-xl bg-muted/50 overflow-auto"
              ></div>
            </div>
            <br />
            <Form
              method="post"
              encType="multipart/form-data"
              className="flex flex-col mx-3 lg:mx-20"
            >
              <div className="flex flex-col lg:flex-row flex-wrap gap-6">
                <div className="hidden md:flex md:flex-col">
                  <Label htmlFor="ylat">&nbsp;&nbsp;Latitude (Y)</Label>
                  <Input
                    ref={refLat}
                    type="number"
                    name="ylat"
                    id="ylat"
                    defaultValue={JOLat}
                  />
                </div>
                <div className="hidden md:flex md:flex-col">
                  <Label htmlFor="xlon">&nbsp;&nbsp;Longitude (X)</Label>
                  <Input
                    ref={refLon}
                    type="number"
                    name="xlon"
                    id="xlon"
                    defaultValue={JOLon}
                  />
                </div>
                <Button className="lg:ml-auto" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
            <br />
            <br />
            <br />
          </li>
        ))}
      </ul>
    </>
  );
}
