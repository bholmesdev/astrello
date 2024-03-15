type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

const MimeType = [
  "text/plain",
  "application/json",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
  "text/xml",
  "application/xml",
  "application/xhtml+xml",
  "image/svg+xml",
  "text/html",
] as const;

type MimeType = (typeof MimeType)[number];

export async function parseFetch<
  TAccept extends MimeType | undefined = undefined
>(
  url: string | URL,
  init: RequestInit & {
    headers?: {
      "Content-Type"?: MimeType;
      Accept?: TAccept;
      [key: string]: string | undefined;
    };
    method?: Method;
  }
): Promise<
  Omit<Response, "body"> & {
    body: TAccept extends "text/html"
      ? DocumentFragment
      : TAccept extends "application/json"
      ? any
      : string;
  }
> {
  const { Accept } = init.headers || {};
  const response = await fetch(url, init);
  if (Accept === "application/json") {
    Object.assign(response, { body: await response.json() });
    return response as any;
  }
  if (Accept === "text/html") {
    const domParser = new DOMParser();
    // Use dom parser to sanitize scripts
    const { body } = domParser.parseFromString(
      await response.text(),
      "text/html"
    );
    // Use template to wrap inner html as document fragment
    const template = document.createElement("template");
    template.innerHTML = body.innerHTML;
    Object.assign(response, { body: template.content });
    return response as any;
  }
  Object.assign(response, { body: await response.text() });
  return response as any;
}
