// leaflet imports
import { useEffect, useRef } from "react";
import { Map as LeafletMap, TileLayer, Marker } from "leaflet";
import "leaflet/styles.css";

// this specific page component import

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
import type { Route } from "./+types/crew_plot_all";
import { redirect } from "react-router";
import { authGuard } from "~/auth/Login";
import { crew_index } from "~/models/Crews";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "crews Master List Plot" },
    { name: "description", content: "crews Master List Plot" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // middleware to guard route from unauthorized entry
  // authenticity guard
  const UserIsNotAuthenticated = !(await authGuard());
  if (UserIsNotAuthenticated) return redirect("/login");

  // main query code
  const todos = await crew_index();
  return { todos };
}

export default function CrewPlotAll({ loaderData }: Route.ComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  useEffect(() => {
    // retreive GPS JSON data from local storage
    const settings = JSON.parse(
      localStorage.getItem("gpsSettings56867e534646")!,
    );
    // ensure that Leaflet map initialization should be done once
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new LeafletMap(mapContainerRef.current).setView(
      [settings.latitude, settings.longitude],
      18,
    );
    mapInstanceRef.current.getContainer().style.cursor = "pointer";
    new TileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 22,
      attribution:
        '&copy; <a href="https://www.google.com/maps/search/">Google Hybrid Map</a>',
    }).addTo(mapInstanceRef.current);

    loaderData.todos?.forEach((todo, index) => {
      const marker = new Marker([todo.ylat, todo.xlon], {
        alt: todo.callsign,
      })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `
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
              `,
        )
        .bindTooltip(`<p class=" font-extrabold">@${todo.callsign}</p>`, {
          permanent: true,
          direction: "top",
        });
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
                <BreadcrumbPage>crews Master List Plot</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-1 pt-0">
        <div
          ref={mapContainerRef}
          className="relative  w-full flex-1 mt-2 rounded-xl bg-muted/50 overflow-auto"
        ></div>
      </div>
    </>
  );
}
