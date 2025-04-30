import { Filed } from "@/Utilities/Filed.ts";

export function OEmbedHandler(ctx: any) {
    ctx.response.type = "application/json+oembed";
    ctx.response.body = Filed("./Source/Content/OEmbed.json");

    return;
}