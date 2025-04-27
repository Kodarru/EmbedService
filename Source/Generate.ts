type Status = {
    "attributedTo": string,
    "content":      string,
    "attachment":   string[]
}

export function generateStatus(ID: string, URL: string, content: string, attachments: string): string {
    const attach = attachments.split(",").map(item => item.trim());

    const status: Status = {
        attributedTo: `${URL}/user.json`,
        content:      content,
        attachment:   attach,
    };

    const fileName = `${ID}.json`;
    const filePath = `./Source/Embed-Data/${fileName}`;

    Deno.mkdirSync("./Source/Embed-Data", { recursive: true });
    Deno.writeTextFileSync(filePath, JSON.stringify(status, null, 2));

    return filePath;
}