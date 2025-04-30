import { Application, Router, send } from "@oak/oak";
import { EmbedData } from "./Embed.ts";
import { HandleBars } from "@/Utilities/Handlebars.ts";
import { EmbedDataType } from "@/Types/EmbedData.d.ts";

const router = new Router();
var URL = "";

router.get("/handleBarTest", async (ctx) => {
    const fileContent = "{{AGH}} guhh {{rizz}} {{rizz}}"

    ctx.response.body = HandleBars(fileContent, {
        AGH: "hello",
        rizz: "sigma",
    });

    return;
})

router.get("/embed/:base64content", async (ctx) => {
    /*const ID = Date.now();
    const URL = ctx.request.url.origin.replace("http://", "https://")
    const redirect = ctx.request.url.searchParams.get("redirect") || "https://discord.com/channels/@me";

    console.log("redirect", redirect);

    const templateHTML = {
        URL: URL,
        Color: ctx.request.url.searchParams.get("color") || "#FFF",
        Footer: ctx.request.url.searchParams.get("footer") || "   ",
    }

    generateStatus(ID.toString(), URL, ctx.params.content, ctx.request.url.searchParams.get("attachments") || "", redirect);

    const file = Deno.readFileSync("./Source/Static/Home.html");
    const fileContent = new TextDecoder().decode(file);

    ctx.response.body = fileContent.toString()
        .replace("{{Color}}", templateHTML.Color)
        .replace("{{ID}}", ID.toString())
        .replace("{{Footer}}", templateHTML.Footer)

        .replaceAll("{{URL}}", templateHTML.URL)

    return;
        */
    const ID = Date.now();
    const URL = ctx.request.url.origin.replace("http://", "https://")

    let DecodedContent: EmbedDataType;

    try {
        DecodedContent = JSON.parse(atob(ctx.params.base64content));
    } catch (error) {
        console.log(error);
        const file = Deno.readFileSync("./Source/Static/Errors/Base64DecodeFailure.html");
        const fileContent = new TextDecoder().decode(file).toString()

        ctx.response.body = HandleBars(fileContent, {
            URL: URL,
        });

        return;
    }

    /*
    const redirect = ctx.request.url.searchParams.get("redirect") || "https://discord.com/channels/@me";

    if (ctx.request.headers.get("User-Agent")?.includes("Discordbot")) {
        ctx.response.body = send()
     }
     */
    let timestamp = false;

    if (DecodedContent.features?.includes("TIMESTAMP")) {
        timestamp = true;
    }

    new EmbedData(URL, ID.toString(), DecodedContent, timestamp);

    const file = Deno.readFileSync("./Source/Static/Home.html");
    const fileContent = new TextDecoder().decode(file).toString()

    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = HandleBars(fileContent, {
        URL: URL,
        ID: ID.toString(),
        FOOTER: DecodedContent.footer || "   ",
        AUTHOR_NAME: DecodedContent.author.name || "EmbedService",
    });
});

router.get("/embed-data/:id", async (ctx) => {
    const id = ctx.params.id;

    if (id === "base64error") {
        const file = Deno.readFileSync("./Source/Static/Errors/Base64Error.json");
        const fileContent = new TextDecoder().decode(file).toString()

        ctx.response.headers.set("Content-Type", "application/activity+json")
        ctx.response.body = HandleBars(fileContent, {
            URL: ctx.request.url.origin.replace("http://", "https://"),
        });

        return;
    }

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

router.get("/user.json/:base64content", async (ctx) => {
    ctx.response.type = "application/json";

    const decodedContent: EmbedDataType.author = JSON.parse(atob(ctx.params.base64content));

    const file = Deno.readFileSync("./Source/Static/user.json");
    const fileContent = new TextDecoder().decode(file).toString()

    ctx.response.body = HandleBars(fileContent, {
        AUTHOR_NAME: decodedContent?.name || "EmbedService",
        AUTHOR_LINK: decodedContent?.link_url || "https://github.com/Kodarru/EmbedService",
        AUTHOR_ICON: decodedContent?.icon_url || "https://upload.wikimedia.org/wikipedia/commons/d/d2/Solid_white.png?20060513000852",
    })

    return;
})

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });