import { EmbedDataType } from "@/Types/EmbedData.d.ts";

export class EmbedData {
    public output: string;

    constructor(
        public URL:       string,
        public ID:        string,
        public data:      EmbedDataType,
        public timestamp: boolean = false,
    ) {
        const Base64Content = btoa(JSON.stringify(data?.author));

        const Embed: EmbedDataType = {
            attributedTo: `${URL}/user.json/${Base64Content}`,
            content:      data.content,
            attachment:   data.attachments,
        };

        if (timestamp) {
            Embed.timestamp = new Date().toISOString();
        }

        const fileName = `${ID}.json`;
        const filePath = `./Source/Embed-Data/${fileName}`;

        Deno.mkdirSync("./Source/Embed-Data", { recursive: true });
        Deno.writeTextFileSync(filePath, JSON.stringify(Embed, null, 2));

        this.output = filePath;
    }
}