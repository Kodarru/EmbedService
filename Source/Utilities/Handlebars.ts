import "@/Types/JSON.d.ts";

export function HandleBars(
    text: string,
    data: JSONData
): string {
    let string = text;

    for (const key in data) {
        if (data[key] === undefined || data[key] === null) {
            data[key] = "";
        }

        string = string.replaceAll(`{{${key}}}`, String(data[key]));
    }

    return string;
}
