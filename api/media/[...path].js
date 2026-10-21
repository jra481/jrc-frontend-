import { proxyToBackend } from "../../server/backendProxy.js";

export default function handler(req, res) {
  return proxyToBackend(req, res, { media: true });
}
