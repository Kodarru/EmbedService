import { HandleBars } from "@/Utilities/Handlebars.ts";
import { EmbedDataType } from "@/Types/EmbedData.d.ts";
import { EmbedData } from "@/Embed.ts";
import { Filed } from "@/Utilities/Filed.ts";

export function EmbedHandler(ctx: any) {
    const ID = Date.now();
    const URL = ctx.request.url.origin.replace("http://", "https://")

    let DecodedContent: EmbedDataType;

    try {
        DecodedContent = JSON.parse(atob(ctx.params.base64content));
    } catch (error) {
        if (ctx.request.headers.get("User-Agent")?.includes("Discordbot")) {
            console.log(error);
            const file = Filed("./Source/Content/Errors/Base64/Main.html");

            ctx.response.body = HandleBars(file, {
                URL: URL,
            });

            return;
        } else {
            ctx.response.redirect("https://discord.com/channels/@me");
        }
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

    const file = Filed("./Source/Content/Main.html");

    if (ctx.request.headers.get("User-Agent")?.includes("Discordbot")) {
        ctx.response.headers.set("Content-Type", "text/html");
        ctx.response.body = HandleBars(file, {
            URL: URL,
            ID: ID.toString(),
            FOOTER: DecodedContent.footer || "   ",
            AUTHOR_NAME: DecodedContent.author.name || "EmbedService",
        });
    } else {
        ctx.response.redirect(DecodedContent.author.link_url || "https://discord.com/channels/@me");
    }

    return;
}
