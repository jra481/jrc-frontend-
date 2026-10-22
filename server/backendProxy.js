const BACKEND_ORIGIN = "https://13-50-221-204.sslip.io";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === "string") return Buffer.from(req.body);
    return Buffer.from(JSON.stringify(req.body));
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function forwardedHeaders(req) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers ?? {})) {
    if (HOP_BY_HOP_HEADERS.has(name.toLowerCase()) || value == null) continue;
    headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  return headers;
}

export async function proxyToBackend(req, res, { media = false } = {}) {
  const incomingUrl = new URL(req.url || "/", "http://vercel.internal");
  let pathname = incomingUrl.pathname;

  if (media && pathname.startsWith("/api/media")) {
    pathname = pathname.slice("/api".length);
  }

  if ((pathname.startsWith("/api/") || pathname.startsWith("/media/")) && !pathname.endsWith("/")) {
    pathname += "/";
  }

  const target = new URL(pathname + incomingUrl.search, BACKEND_ORIGIN);
  const method = req.method || "GET";
  const init = {
    method,
    headers: forwardedHeaders(req),
    redirect: "manual",
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await readBody(req);
  }

  try {
    const upstream = await fetch(target, init);
    res.statusCode = upstream.status;

    // Fetch exposes multiple Set-Cookie headers separately in Node runtimes
    // that support getSetCookie(). Preserve that array when returning the
    // response; combining the access and refresh cookies makes browsers drop
    // one of them and causes an apparently successful login to log out again
    // on the first authenticated dashboard request.
    const setCookies = typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

    for (const [name, value] of upstream.headers) {
      const normalizedName = name.toLowerCase();
      if (!HOP_BY_HOP_HEADERS.has(normalizedName) && normalizedName !== "set-cookie") {
        res.setHeader(name, value);
      }
    }

    if (setCookies.length) {
      res.setHeader("set-cookie", setCookies);
    } else {
      const setCookie = upstream.headers.get("set-cookie");
      if (setCookie) res.setHeader("set-cookie", setCookie);
    }

    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error("Backend proxy request failed", error);
    res.statusCode = 502;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ detail: "Backend unavailable" }));
  }
}
