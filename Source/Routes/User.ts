import { HandleBars } from "@/Utilities/Handlebars.ts";
import { EmbedDataType } from "@/Types/EmbedData.d.ts";
import { Filed } from "@/Utilities/Filed.ts";

export function UserHandler(ctx: any) {
    ctx.response.type = "application/json";

    if (ctx.params.base64content === "base64error") {
        ctx.response.body = Filed("./Source/Content/Errors/Base64/User.json")
        return;
    }

    const decodedContent: EmbedDataType.author = JSON.parse(atob(ctx.params.base64content));
    const file = Filed("./Source/Content/User.json");

    ctx.response.body = HandleBars(file, {
        AUTHOR_NAME: decodedContent.name || "EmbedService",
        AUTHOR_LINK: decodedContent.link_url || "https://github.com/Kodarru/EmbedService",
        AUTHOR_ICON: decodedContent.icon_url || "https://upload.wikimedia.org/wikipedia/commons/d/d2/Solid_white.png?20060513000852",
    })

    return;
}