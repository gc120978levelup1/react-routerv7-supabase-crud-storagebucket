// leaflet imports
import { useEffect, useRef, useState } from "react";
import { Map as LeafletMap, TileLayer, Marker } from "leaflet";
import "leaflet/styles.css";

// this specific page component import
// specific component import
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "~/components/ui/field";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { Button } from "@base-ui/react";
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
import type { Route } from "./+types/JO_crew_accept";
import { createClientSPA } from "../lib/supabase.client.spa";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
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
  if (!error) {
    return { todos, count, joId: todos[0].id };
  }
}

export async function clientAction({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const status = formData.get("status") as string;
  const { supabase } = createClientSPA();
  if (status === "new") {
    await supabase
      .from("jobs")
      .update({
        status: status,
        dateAssigned: null,
        dateAccepted: null,
        crewId: null,
      })
      .eq("id", params.id);
    return redirect(`/JO_show/${params.id}`);
  } else if (status === "accepted") {
    await supabase
      .from("jobs")
      .update({
        status: status,
        dateAccepted: new Date(),
      })
      .eq("id", params.id);
    return redirect(`/JO_show/${params.id}`);
  }
}

export default function PersonnelData({ loaderData }: Route.ComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [JOLat, setJOLat] = useState(0.0);
  const [JOLon, setJOLon] = useState(0.0);
  const scrollhereRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ensure that Leaflet map initialization should be done once
    if (!loaderData!.todos![0].ylat) return;
    if (!loaderData!.todos![0].xlon) return;
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new LeafletMap(mapContainerRef.current).setView(
      [loaderData!.todos![0].ylat, loaderData!.todos![0].xlon],
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
      [loaderData!.todos![0].ylat, loaderData!.todos![0].xlon],
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
                <BreadcrumbPage>Job Order - Acceptance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <ul className=" flex flex-col">
        <div>
          <h1 className="flex flex-row">
            <p className=" ml-30 mr-auto w-fit">Job Order Data</p>
            <a
              className=" flex flex-row gap-2 ml-auto mr-30 px-3 rounded-lg border-2 bg-green-950 hover:text-blue-200 hover:font-extrabold hover:bg-amber-700 hover:cursor-pointer hover:border-4"
              href={`/JO_show/${loaderData!.joId}`}
            >
              <ListPlus />
              Back to Main Job Order Interface
            </a>
          </h1>
        </div>
        <br />
        {loaderData!.todos?.map((todo) => (
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
                    <a href={`/crew_show_data/${todo.crewId}`}>
                      <p className=" text-center font-extrabold text-lg underline text-blue-200 bg-amber-900 hover:bg-green-900 rounded-full border-4">
                        {todo.crewId}
                      </p>
                    </a>
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
                  <p>
                    {" "}
                    <a href=""></a>
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-1 pt-0">
                  <div
                    ref={mapContainerRef}
                    className="relative  w-full h-[60vh] md:h-[75vh] md:w-[90%] md:mx-auto mt-2 rounded-xl bg-muted/50 overflow-auto"
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
                <p ref={scrollhereRef} className=" ml-10 mr-auto w-fit">
                  Please decide whether to accept or reject the Job Order
                </p>
                <Form
                  method="post"
                  encType="multipart/form-data"
                  className="flex flex-col mx-3 lg:mx-20"
                >
                  <div className="flex flex-col lg:flex-row flex-wrap gap-6">
                    <RadioGroup
                      defaultValue="new"
                      name="status"
                      id="status"
                      className="max-w-sm"
                    >
                      <FieldLabel htmlFor="Accept<">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Accept</FieldTitle>
                            <FieldDescription>
                              Accepts Job Order
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="accepted" id="Accpt" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="Reject">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Reject</FieldTitle>
                            <FieldDescription>
                              Turn down Job Order
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="new" id="Reject" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>

                    <Button
                      className="lg:ml-auto border-2 p-3 max-h-20 cursor-pointer hover:bg-gray-800"
                      type="submit"
                    >
                      Submit Decision
                    </Button>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
