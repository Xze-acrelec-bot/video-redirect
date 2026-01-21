module.exports = async function (context, req) {
  try {
    const STORAGE_ACCOUNT = "storagevideov1";
    const CONTAINER = "videos";
 
    const marker = req.query.marker ? `&marker=${encodeURIComponent(req.query.marker)}` : "";
    const url =
      `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER}` +
      `?restype=container&comp=list${marker}`;
 
    const r = await fetch(url);
    if (!r.ok) {
      context.res = { status: 502, body: `Blob list failed: ${r.status}` };
      return;
    }
 
    const xml = await r.text();
    const names = [...xml.matchAll(/<Name>([^<]+)<\/Name>/g)].map(m => m[1]);
 
    const items = names
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({
        name,
        url: `/api/video/${encodeURIComponent(name).replace(/%2F/g, "/")}`
      }));
 
    const nextMarkerMatch = xml.match(/<NextMarker>([^<]*)<\/NextMarker>/);
    const nextMarker = nextMarkerMatch && nextMarkerMatch[1] ? nextMarkerMatch[1] : null;
 
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
      body: { items, nextMarker }
    };
  } catch (e) {
    context.res = { status: 500, body: `Error: ${e.message}` };
  }
};
