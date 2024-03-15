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

export async function fetchJson(
  url: string | URL,
  init: RequestInit & {
    headers?: {
      "Content-Type"?: MimeType;
      Accept?: "application/json";
      [key: string]: string | undefined;
    };
    method?: Method;
  }
) {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  return { ...res, body: await res.json() };
}

export async function fetchHtml(
  url: string | URL,
  init?: RequestInit & {
    headers?: {
      "Content-Type"?: MimeType;
      Accept?: "text/html";
      [key: string]: string | undefined;
    };
    method?: Method;
  }
) {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "text/html", ...init?.headers },
  });
  const domParser = new DOMParser();
  const { body } = domParser.parseFromString(await res.text(), "text/html");
  const template = document.createElement("template");
  template.innerHTML = body.innerHTML;
  return { ...res, body: template.content };
}

export async function fetchHtmlDocument(
  url: string | URL,
  init?: RequestInit & {
    headers?: {
      "Content-Type"?: MimeType;
      Accept?: "text/html";
      [key: string]: string | undefined;
    };
    method?: Method;
  }
) {
  const res = await fetch(url, init);
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(await res.text(), "text/html");
  return { ...res, body: doc };
}

export async function fetchText(
  url: string | URL,
  init?: RequestInit & {
    headers?: {
      "Content-Type"?: MimeType;
      Accept?: MimeType;
      [key: string]: string | undefined;
    };
    method?: Method;
  }
) {
  const res = await fetch(url, init);
  return { ...res, body: await res.text() };
}
