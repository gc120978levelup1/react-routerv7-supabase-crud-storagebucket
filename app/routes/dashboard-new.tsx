import { useEffect, useRef } from "react";
import { Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/styles.css";

import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Dashboard() {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  useEffect(() => {
    // ensure that Leaflet map initialization should be done once
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new LeafletMap(mapContainerRef.current).setView(
      [51.505, -0.09],
      18,
    );
    new TileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 22,
      attribution:
        '&copy; <a href="https://www.google.com/maps/search/">GoogleMap</a>',
    }).addTo(mapInstanceRef.current);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Data Fetching
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Igit</BreadcrumbPage>
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
        
      </SidebarInset>
    </SidebarProvider>
  );
}
