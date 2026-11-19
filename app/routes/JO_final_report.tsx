// leaflet imports
import { useEffect, useRef, useState } from "react";
import { Map as LeafletMap, TileLayer, Marker } from "leaflet";
import "leaflet/styles.css";

// this specific page component import
// specific component import
import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

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
import type { Route } from "./+types/JO_show";
import { createClientSPA } from "../lib/supabase.client.spa";
import { Form, type ActionFunctionArgs, redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personnel Data" },
    { name: "description", content: "Personnel Data" },
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
  const {
    data: todos,
    count,
    error,
  } = await supabase.from("jobs").select("*").eq("id", params.id);
  return { todos, count };
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const dateFinished = formData.get("dateFinished");
  const dateReported = new Date();
  const jobtype = formData.get("jobtype") as string;
  const reportDescription = formData.get("reportDescription") as string;
  const { supabase } = createClientSPA();
  const { error } = await supabase
    .from("jobs")
    .update({ jobtype, dateFinished, dateReported, reportDescription })
    .eq("id", params.id);
  return redirect(`/JO_show/${params.id}`);
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  const frameworks = ["ISD", "MNT", "CONST", "LIVELINE"] as const;
  const [date, setDate] = React.useState<Date>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [JOLat, setJOLat] = useState(0.0);
  const [JOLon, setJOLon] = useState(0.0);
  useEffect(() => {
    // ensure that Leaflet map initialization should be done once
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new LeafletMap(mapContainerRef.current).setView(
      [loaderData.todos![0].ylat, loaderData.todos![0].xlon],
      18,
    );

    mapInstanceRef.current.getContainer().style.cursor = "pointer";
    mapInstanceRef.current.doubleClickZoom.disable();
    new TileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 22,
      attribution:
        '&copy; <a href="https://www.google.com/maps/search/">Google Hybrid Map</a>',
    }).addTo(mapInstanceRef.current);

    // You Marker
    const settings = JSON.parse(
      localStorage.getItem("gpsSettings56867e534646")!,
    );
    setJOLat(settings.latitude);
    setJOLon(settings.longitude);
    new Marker([settings.latitude, settings.longitude], {
      alt: `Me Marker`,
    })
      .addTo(mapInstanceRef.current!)
      .bindPopup(
        `
              <div class=" flex flex-col w-full m-0">
                <div class=" mt-1">marker</div>
                <div class=" text-md font-extrabold">${"Me"}</div>
              </div>
              `,
      )
      .bindTooltip("Me", {
        permanent: true,
        direction: "top",
      });

    // JO Marker
    const JOMarker = new Marker(
      [loaderData.todos![0].ylat, loaderData.todos![0].xlon],
      {
        alt: `JO Marker`,
      },
    )
      .addTo(mapInstanceRef.current!)
      .bindPopup(
        `
              <div class=" flex flex-col w-full m-0">
                <div class=" mt-1">marker</div>
                <div class=" text-md font-extrabold">${"JO Marker"}</div>
              </div>
              `,
      )
      .openPopup()
      .bindTooltip("Job Order Location", {
        permanent: true,
        direction: "top",
      });
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
                <BreadcrumbPage>Job Order - Show Item</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul className=" flex flex-col">
        {loaderData.todos?.map((todo) => (
          <li key={todo.id}>
            <div className="flex flex-col md:flex-row gap-2">
              <p className=" mx-auto md:ml-30 md:mr-auto w-fit">Action Menu</p>
              <div className="flex flex-col gap-2">
                <h1 className="flex flex-col md:flex-row gap-2">
                  <a
                    className=" flex flex-row text-center  gap-2 ml-2 mr-3 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                    href={`/JO_add_after_picture1/${todo.id}`}
                  >
                    <ListPlus />
                    After Image 1
                  </a>
                  <a
                    className=" flex flex-row text-center  gap-2 ml-2 mr-3 md:mr-3 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                    href={`/JO_add_after_picture2/${todo.id}`}
                  >
                    <ListPlus />
                    After Image 2
                  </a>
                  <a
                    className="flex flex-row text-center gap-2 ml-2 mr-3 md:mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                    href={`/JO_show/${todo.id}`}
                  >
                    <ListPlus />
                    Back to Main Job Order Interface
                  </a>
                </h1>
              </div>
            </div>
            <br />
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
                    <Label htmlFor="dateAssigned">dateAssigned</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.dateAssigned}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="dateAccepted">dateAccepted</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.dateAccepted}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="status">status</Label>
                    <p className=" font-extrabold text-lg">{todo.status}</p>
                  </div>
                  <div>
                    <Label htmlFor="crewId">crewId</Label>
                    <a href={`/crew_show_data/${todo.crewId}`}>
                      <p className=" text-center font-extrabold text-lg underline text-blue-200 bg-amber-900 hover:bg-green-900 rounded-full border-4">
                        {todo.crewId}
                      </p>
                    </a>
                  </div>
                  <div>
                    <Label htmlFor="description">description</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.description}
                    </p>
                  </div>
                  <div className="hidden">
                    <Label htmlFor="dateReported">dateReported</Label>
                    <p className=" font-extrabold text-lg">
                      {todo.dateReported}
                    </p>
                  </div>
                  <div className="w-full">
                    <Form
                      method="post"
                      encType="multipart/form-data"
                      className="flex flex-col"
                    >
                      <div className="flex flex-col md:flex-row md:flex-wrap gap-5">
                        <div className="h-10 w-full md:w-[48%]">
                          <Label htmlFor="dateFinished">dateFinished</Label>
                          <p className=" hidden font-extrabold text-lg">
                            {todo.dateFinished}
                          </p>
                          <Input
                            className=" h-10 w-full"
                            type="date"
                            name="dateFinished"
                            id="dateFinished"
                            defaultValue={todo.dateFinished}
                          />
                        </div>

                        <div className="h-10 w-full md:w-[48%]">
                          <Label htmlFor="jobtype">jobtype</Label>
                          <p className=" hidden font-extrabold text-lg">
                            {todo.jobtype}
                          </p>
                          <Combobox
                            items={frameworks}
                            id="jobtype"
                            name="jobtype"
                            defaultValue={todo.jobtype}
                          >
                            <ComboboxInput placeholder="Select Job Order Type" />
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

                        <div className="w-full gap-6">
                          <Label htmlFor="reportDescription">
                            reportDescription
                          </Label>
                          <p className=" hidden font-extrabold text-lg">
                            {todo.reportDescription}
                          </p>
                          <Textarea
                            className=" grow mt-2 text-2xl h-50"
                            placeholder="Type your message here."
                            id="reportDescription"
                            name="reportDescription"
                            defaultValue={todo.reportDescription}
                          />
                        </div>
                        <div className=" ml-auto">
                          <button
                            className=" flex flex-row gap-2 mx-auto my-0 rounded-lg border-2 p-3 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
                            type="submit"
                          >
                            <Save />
                            Yes, Upload
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div className="flex flex-col md:flex-row flex-wrap gap-2">
                    <div>
                      <Label className="mb-2" htmlFor="beforepicture1">
                        beforepicture1
                      </Label>
                      <img
                        src={todo.beforepicture1}
                        width={180}
                        alt="beforepicture1"
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="beforepicture2">
                        beforepicture2
                      </Label>
                      <img
                        src={todo.beforepicture2}
                        width={180}
                        alt="beforepicture2"
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="afterpicture1">
                        afterpicture1
                      </Label>
                      <img
                        src={todo.afterpicture1}
                        width={180}
                        alt="afterpicture1"
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="afterpicture2">
                        afterpicture2
                      </Label>
                      <img
                        src={todo.afterpicture2}
                        width={180}
                        alt="afterpicture2"
                      />
                    </div>
                  </div>
                  <p>
                    {" "}
                    <a href=""></a>
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-1 pt-0 w-full">
                  <div
                    ref={mapContainerRef}
                    className="relative  w-full h-[60vh] md:h-[75vh] md:mx-auto mt-2 rounded-xl bg-muted/50 overflow-auto"
                  ></div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/${JOLat},${JOLon}/${todo.ylat},${todo.xlon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" text-blue-300"
                >
                  Send Direction To Google Map
                </a>
                <a
                  href={`https://www.google.com/maps?q&layer=c&cbll=${todo.ylat},${todo.xlon}&cbp=0,0,0,0,-25&z=-10`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" text-blue-300"
                >
                  See in Street View
                </a>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
