"use client";
import { createClientSPA } from "../lib/supabase.client.spa";
import * as React from "react";
import { useEffect, useState } from "react";
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
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user1, setUser1] = useState({
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  });

  const [duty_status, setDuty_status] = useState({
    email: "m@example.com",
    status: "",
  });
  // slow heartbeat for database comms
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>
          <div className="ml-2 text-sm">
            Duty Status:&nbsp;&nbsp;
            <span className=" font-extrabold text-green-500 text-lg">
              {duty_status.status}
            </span>
          </div>
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
