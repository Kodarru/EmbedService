import { EmbedDataType } from "@/Types/EmbedData.d.ts";

export class EmbedData {
    public output: string;

    constructor(
        public ID:   string,
        public data: EmbedDataType,
        public URL:  string,
    ) {
        const Base64Content = btoa(JSON.stringify(data?.author));

        const status: EmbedDataType = {
            attributedTo: `${URL}/user.json/${Base64Content}`,
            content:      data.content,
            attachment:   data.attachments,
        };

        const fileName = `${ID}.json`;
        const filePath = `./Source/Embed-Data/${fileName}`;

        Deno.mkdirSync("./Source/Embed-Data", { recursive: true });
        Deno.writeTextFileSync(filePath, JSON.stringify(status, null, 2));

        this.output = filePath;
    }
}