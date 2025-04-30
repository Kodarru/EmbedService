import { HandleBars } from "@/Utilities/Handlebars.ts";
import { Filed } from "@/Utilities/Filed.ts";

export function EmbedDataHandler(ctx: any) {
    const id = ctx.params.id;

    if (id === "base64error") {
        const file = Filed("./Source/Content/Errors/Base64/Message.json");

        ctx.response.headers.set("Content-Type", "application/activity+json")
        ctx.response.body = HandleBars(file, {
            URL: ctx.request.url.origin.replace("http://", "https://"),
        });

        return;
    }

    try {
        ctx.response.headers.set("Content-Type", "application/activity+json")
        ctx.response.body = Filed(`./Embed-Data/${id}.json`);
    } catch (error) {
        if (!ctx.response.writable) return;
        ctx.response.status = 404;
        ctx.response.body = "File not found";
    }

    return;
}