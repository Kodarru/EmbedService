import { Application, Router, send } from "@oak/oak";
import { Handlebars } from "https://deno.land/x/handlebars/mod.ts"
import { generateStatus } from "./Generate.ts";

const router = new Router();
const handlebars = new Handlebars();

router.get("/embed/:content", async (ctx) => {
    const ID = Date.now();
    const URL = ctx.request.url.origin.replace("http://", "https://")

    const templateHTML = {
        URL: URL,
        Color: ctx.request.url.searchParams.get("color") || "#FFF",
        Footer: ctx.request.url.searchParams.get("footer") || "   ",
    }

    generateStatus(ID.toString(), URL, ctx.params.content, ctx.request.url.searchParams.get("attachments") || "");

    const file = Deno.readFileSync("./Source/Static/Home.html");
    const fileContent = new TextDecoder().decode(file);

    ctx.response.body = fileContent.toString()
        /* Templating */
        .replace("{{Color}}", templateHTML.Color)
        .replace("{{ID}}", ID.toString())
        .replace("{{Footer}}", templateHTML.Footer)
        /* URL */
        .replaceAll("{{URL}}", templateHTML.URL)
        .replace("{{REDIRECT}}", ctx.request.url.searchParams.get("redirect") || "https://discord.com/channels/@me");

    return;
});

router.get("/embed-data/:id", async (ctx) => {
    const id = ctx.params.id;

    try {
        await send(ctx, `./Source/Embed-Data/${id}.json`)
        ctx.response.headers.set("Content-Type", "application/activity+json")
    } catch (error) {
        if (!ctx.response.writable) return;
        ctx.response.status = 404;
        ctx.response.body = "File not found";
    }
})

router.get("/oembed.json", async (ctx) => {
    ctx.response.type = "application/json+oembed";
    ctx.response.body = Deno.readFileSync("./Source/Static/oembed.json");
})

router.get("/user.json", async (ctx) => {
    ctx.response.type = "application/json";

    const redirect = ctx.request.url.searchParams.get("redirect")
    const file = Deno.readFileSync("./Source/Static/user.json");
    const fileContent = new TextDecoder().decode(file);

    ctx.response.body = fileContent.toString()
        .replace("{{REDIRECT}}", redirect || "https://discord.com/channels/@me")
})

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });