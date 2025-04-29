type EmbedDataType = {
    content:       string;
    /* If you don't want to attach anything, just set it to [] */
    attachments:   string[];
    footer?:       string;
    author?: {
        name?:     string;
        link_url?: string;
        icon_url?: string;
    }
}