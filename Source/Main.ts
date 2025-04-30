import { Application, Router } from "@oak/oak";

/* Routes */
import { EmbedHandler} from "./Routes/Embed.ts";
import { EmbedDataHandler } from "./Routes/Embed-Data.ts";
import { UserHandler } from "./Routes/User.ts";
import { OEmbedHandler } from "./Routes/OEmbed.ts";

/* Node Modules */
import process from "node:process";

/* Router */
const router = new Router()
    .get("/embed-data/:id", EmbedDataHandler)
    .get("/embed/:base64content", EmbedHandler)
    .get("/oembed.json", OEmbedHandler)
    .get("/user.json/:base64content", UserHandler);

/* Application Logic */
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({
    port: parseInt(process.env.PORT || "8000", 10)
});