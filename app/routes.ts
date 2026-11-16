import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    route("home","routes/home.tsx"),
    route("login", "routes/login.tsx"),
    layout("routes/dashboard.tsx", [
        index("routes/_index.tsx"),
        route("add", "routes/add.tsx"),
        route("avat_picture", "routes/avat_picture.tsx"),
        route("show/:id", "routes/show.tsx"),
        route("edit/:id", "routes/edit.tsx"),
        route("delete/:id", "routes/delete.tsx"),
        route("password", "routes/password.tsx"),
        route("logout", "routes/logout.tsx"),
    ]),
] satisfies RouteConfig;
