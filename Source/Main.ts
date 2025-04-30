import { Application, Router } from "@oak/oak";
import { HandleBars } from "@/Utilities/Handlebars.ts";
import { EmbedDataType } from "@/Types/EmbedData.d.ts";
import { EmbedData } from "./Embed.ts";
import { Filed } from "./Utilities/Filed.ts";

const router = new Router();

router.get("/embed/:base64content", async (ctx) => {
    const ID = Date.now();
    const URL = ctx.request.url.origin.replace("http://", "https://")

    let DecodedContent: EmbedDataType;

    try {
        DecodedContent = JSON.parse(atob(ctx.params.base64content));
    } catch (error) {
        console.log(error);
        const file = Filed("./Source/Static/Errors/Base64/Main.html");

        ctx.response.body = HandleBars(file, {
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

    new EmbedData(
        URL,
        ID.toString(),
        DecodedContent,
        DecodedContent.features?.includes("TIMESTAMP") || false
    );

    const file = Filed("./Source/Static/Main.html");

    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = HandleBars(file, {
        URL: URL,
        ID: ID.toString(),
        FOOTER: DecodedContent.footer || "   ",
        AUTHOR_NAME: DecodedContent.author.name || "EmbedService",
    });
});

router.get("/embed-data/:id", async (ctx) => {
    const id = ctx.params.id;

    if (id === "base64error") {
        const file = Filed("./Source/Static/Errors/Base64/Message.json");

        ctx.response.headers.set("Content-Type", "application/activity+json")
        ctx.response.body = HandleBars(file, {
            URL: ctx.request.url.origin.replace("http://", "https://"),
        });

        return;
    }

    try {
        ctx.response.headers.set("Content-Type", "application/activity+json")
        ctx.response.body = Filed(`./Source/Embed-Data/${id}.json`);
    } catch (error) {
        if (!ctx.response.writable) return;
        ctx.response.status = 404;
        ctx.response.body = "File not found";
    }
})

router.get("/oembed.json", async (ctx) => {
    ctx.response.type = "application/json+oembed";
    ctx.response.body = Filed("./Source/Static/OEmbed.json");
})

router.get("/user.json/:base64content", async (ctx) => {
    ctx.response.type = "application/json";

    if (ctx.params.base64content === "base64error") {
        ctx.response.body = Filed("./Source/Static/Errors/Base64/User.json")
        return;
    }

    const decodedContent: EmbedDataType.author = JSON.parse(atob(ctx.params.base64content));
    const file = Filed("./Source/Static/User.json");

    ctx.response.body = HandleBars(file, {
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