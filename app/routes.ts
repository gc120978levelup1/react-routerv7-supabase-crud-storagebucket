import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    route("home", "routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("dashboard-new", "routes/dashboard-new.tsx"),
    layout("routes/dashboard.tsx", [

        index("routes/_index.tsx"),
        route("add", "routes/add.tsx"),
        route("show/:id", "routes/show.tsx"),
        route("edit/:id", "routes/edit.tsx"),
        route("delete/:id", "routes/delete.tsx"),

        route("crew_master_list","routes/crew_master_list.tsx"),
        route("crew_plot_on_duty","routes/crew_plot_on_duty.tsx"),
        route("crew_plot_all","routes/crew_plot_all.tsx"),
        route("crew_plot_on_map/:id","routes/crew_plot_on_map.tsx"),
        route("crew_show_data/:id","routes/crew_show_data.tsx"),

        route("JO_master","routes/JO_master.tsx"),
        route("JO_new","routes/JO_new.tsx"),
        route("JO_master_me","routes/JO_master_me.tsx"),
        route("JO_master_me_created","routes/JO_master_me_created.tsx"),
        route("JO_show/:id","routes/JO_show.tsx"),
        route("JO_edit/:id","routes/JO_edit.tsx"),
        route("JO_delete/:id","routes/JO_delete.tsx"),
        route("JO_add_before_picture1/:id","routes/JO_add_before_picture1.tsx"),
        route("JO_add_before_picture2/:id","routes/JO_add_before_picture2.tsx"),
        route("JO_add_after_picture1/:id","routes/JO_add_after_picture1.tsx"),
        route("JO_add_after_picture2/:id","routes/JO_add_after_picture2.tsx"),
        route("JO_assign_crew/:id","routes/JO_assign_crew.tsx"),
        route("JO_assign_crew_select/:id/crew/:crewId","routes/JO_assign_crew_select.tsx"),
        route("JO_assign_gis_tagging/:id","routes/JO_assign_gis_tagging.tsx"),
        route("JO_crew_accept/:id","routes/JO_crew_accept.tsx"),
        route("JO_final_report/:id","routes/JO_final_report.tsx"),

        route("personnel_data", "routes/personnel_data.tsx"),
        route("personnel_data_update", "routes/personnel_data_update.tsx"),
        route("personnel_duty_status_update", "routes/personnel_duty_status_update.tsx"),

        route("avat_picture", "routes/avat_picture.tsx"),
        route("user_display", "routes/user_display.tsx"),
        route("password", "routes/password.tsx"),
        route("logout", "routes/logout.tsx"),
    ]),

] satisfies RouteConfig;
