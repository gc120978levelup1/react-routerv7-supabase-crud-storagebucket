"use client";
import { createClientSPA } from "../lib/supabase.client.spa";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { NavMain } from "~/components/nav-main";
import { NavProjects } from "~/components/nav-projects";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Table1",
      url: "#",
      icon: <TerminalSquareIcon />,
      //isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Add a New Item",
          url: "/add",
        },
      ],
    },
    {
      title: "Crews",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "Master List",
          url: "/crew_master_list",
        },
        {
          title: "Plot On Duty Crew to Map",
          url: "/crew_plot_on_duty",
        },
        {
          title: "Plot All Crews to Map",
          url: "/crew_plot_all",
        },
      ],
    },
    {
      title: "Job Orders",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Master List",
          url: "/JO_master",
        },
        {
          title: "Create New Job Order",
          url: "/JO_new",
        },
        {
          title: "List of My Job Order",
          url: "#",
        },
        {
          title: "Plot All of my Job Orders",
          url: "#",
        },
        {
          title: "Plot All Pending Job Orders",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Close Job Order",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Maintenance JO",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Live Line JO",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Construction JO",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "ISD JO",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};
const { supabase } = createClientSPA();
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const gpsXLon = useRef(0);
  const gpsYLat = useRef(0);
  const gpsSpeed = useRef(0);
  const useremail = useRef("m@example.com");

  const [user1, setUser1] = useState({
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  });

  const [duty_status, setDuty_status] = useState({
    email: "m@example.com",
    status: "",
  });

  const [mounted, setMounted] = useState(false);
  const intID1 = useRef<ReturnType<typeof setInterval> | null>(null);
  const intID2 = useRef<ReturnType<typeof setInterval> | null>(null);
  const gpsDataAvailable = useRef(false);

  // read gps location and broadcast it to fast comms
  /*
  const gpsLocation = () => {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true, // Forces GPS hardware instead of Wi-Fi/IP
        timeout: 10000, // Wait up to 10 seconds for a reading
        maximumAge: 0, // Do not use cached location data
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;

          // Speed is returned in meters per second (m/s) or null if unavailable
          const speedKmh = speed !== null ? (speed * 3.6).toFixed(1) : "0.0";
          const speedMph =
            speed !== null ? (speed * 2.23694).toFixed(1) : "0.0";

          //console.log(`Latitude: ${latitude}`);
          //console.log(`Longitude: ${longitude}`);
          //console.log(`Accuracy: ±${accuracy} meters`);
          //console.log(
          //  `Speed: ${speed ?? 0} m/s (${speedKmh} km/h | ${speedMph} mph)`,
          // );

          gpsXLon.current = longitude;
          gpsYLat.current = latitude;
          gpsSpeed.current = speed! * 3.6;

          const settings = {
            longitude: longitude,
            latitude: latitude,
            speed36: speed! * 3.6,
          };
          // save GPS location to be used anytime
          localStorage.setItem(
            "gpsSettings56867e534646",
            JSON.stringify(settings),
          );
        },
        (error) => {
          console.error(`Error (${error.code}): ${error.message}`);
        },
        options,
      );

      // To stop tracking later, call:
      // navigator.geolocation.clearWatch(watchId);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  gpsLocation();
*/

  useEffect(() => {
    // check if gps is available
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by your browser.");
      //setLoading(false);
      return;
    }

    // if gps ok, sync and get data and store in local storage
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, speed, accuracy } = position.coords;
        const speedKmh = speed !== null ? (speed * 3.6).toFixed(1) : "0.0";
        const speedMph = speed !== null ? (speed * 2.23694).toFixed(1) : "0.0";

        //console.log(`Latitude: ${latitude}`);
        //console.log(`Longitude: ${longitude}`);
        //console.log(`Accuracy: ±${accuracy} meters`);
        //console.log(
        //  `Speed: ${speed ?? 0} m/s (${speedKmh} km/h | ${speedMph} mph)`,
        // );

        gpsXLon.current = longitude;
        gpsYLat.current = latitude;
        gpsSpeed.current = speed! * 3.6;
        const settings = {
          longitude: longitude,
          latitude: latitude,
          speed36: speed! * 3.6,
        };
        // save GPS location to be used anytime
        localStorage.setItem(
          "gpsSettings56867e534646",
          JSON.stringify(settings),
        );

        // check if the gps signal is first time
        // if first time signal then execute commands
        console.log("garry gps accuracy ", accuracy);
        const gps_accuracy_limit = 200; //meters
        if (accuracy > gps_accuracy_limit) gpsDataAvailable.current = true;
        if (!gpsDataAvailable.current) {
          console.log("garry first time gps data...");
          console.log("garry gps accuracy ", accuracy);
          save_user_gps_data();
          subscribe_to_user_data();
          subscribe_to_user_duty_status();
        }
        gpsDataAvailable.current = true;
        if (accuracy > gps_accuracy_limit) gpsDataAvailable.current = false;
      },
      (err) => {
        //setError(err.message);
        //setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Prevent infinite blocking if GPS hangs
        maximumAge: 0,
      },
    );

    // slow heartbeat for remote database comms
    const save_user_gps_data = () => {
      console.log("garry save_user_gps_data", {
        email: useremail.current,
        speed: gpsSpeed.current,
        xlon: gpsXLon.current,
        ylat: gpsYLat.current,
      });
      if (
        useremail.current !== "m@example.com" &&
        gpsXLon.current > 0 &&
        gpsYLat.current > 0
      ) {
        supabase
          .from("crews")
          .upsert(
            {
              email: useremail.current,
              speed: gpsSpeed.current,
              xlon: gpsXLon.current,
              ylat: gpsYLat.current,
            },
            { onConflict: "email" },
          )
          .select()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching data:", error);
              return;
            }
            if (data) {
              console.log("garry error data=", data);
            }
          });
      }
    };
    if (!intID1.current)
      intID1.current = setInterval(() => {
        save_user_gps_data();
      }, 60000);

    // fast heartbeat for local comms
    const subscribe_to_user_data = () => {
      const rawData = localStorage.getItem("userSettings1234567890");
      if (rawData) {
        const userSettings = JSON.parse(rawData);
        //console.log("garry error userSettings= ", userSettings);
        setUser1(userSettings);
      }
    };
    const subscribe_to_user_duty_status = () => {
      const rawData2 = localStorage.getItem("userDutyStatus1234567890");
      if (rawData2) {
        const userDutyStatus = JSON.parse(rawData2);
        useremail.current = userDutyStatus.email;
        setDuty_status(userDutyStatus);
      }
    };
    if (!intID2.current)
      intID2.current = setInterval(() => {
          subscribe_to_user_data();
          subscribe_to_user_duty_status();
      }, 1000);

    save_user_gps_data();
    subscribe_to_user_data();
    subscribe_to_user_duty_status();

    //cleanup code
    return () => {
      if (intID1.current) {
        clearInterval(intID1.current);
        intID1.current = null;
      }
      if (intID2.current) {
        clearInterval(intID2.current);
        intID2.current = null;
      }
      setMounted(false);
    };
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>
          <a href="/personnel_duty_status_update">
            <div className="ml-2 text-sm">
              Duty Status:&nbsp;&nbsp;
              <span className=" font-extrabold text-green-500 text-lg">
                {duty_status.status}
              </span>
            </div>
          </a>
        </SidebarGroupLabel>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user1} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
