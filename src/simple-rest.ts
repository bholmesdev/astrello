type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

const DOMMimeType = [
  "text/html",
  "text/xml",
  "application/xml",
  "application/xhtml+xml",
  "image/svg+xml",
] as const;

type DOMMimeType = (typeof DOMMimeType)[number];

const MimeType = [
  "text/plain",
  "application/json",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
  ...DOMMimeType,
] as const;

type MimeType = (typeof MimeType)[number];

function isDomMimeType(mimeType: string): mimeType is DOMMimeType {
  return DOMMimeType.includes(mimeType as any);
}

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
    body: TAccept extends DOMMimeType
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
  if (Accept && isDomMimeType(Accept)) {
    const domParser = new DOMParser();
    const { body } = domParser.parseFromString(await response.text(), Accept);
    const template = document.createElement("template");
    template.appendChild(body);
    Object.assign(response, { body: template.content });
    return response as any;
  }
  Object.assign(response, { body: await response.text() });
  return response as any;
}
