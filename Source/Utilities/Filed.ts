export function Filed(
    path: string,
): string {
    const file = Deno.readFileSync(path);
    return new TextDecoder().decode(file).toString()
}