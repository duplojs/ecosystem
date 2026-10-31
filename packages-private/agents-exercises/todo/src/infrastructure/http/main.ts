import { createHub, routeStore } from "@duplojs/http";

import "./routes";

const hub = createHub({
	environment: "DEV",
})
	.register(routeStore.getAll());
