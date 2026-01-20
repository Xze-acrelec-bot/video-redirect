module.exports = async function (context, req) {
  const file = context.bindingData.file;
 
  if (!file) {
    context.res = { status: 400, body: "Fichier manquant" };
    return;
  }
 
  const redirectUrl = `https://storagevideo1.blob.core.windows.net/videos/${file}`;
 
  context.res = {
    status: 302,
    headers: {
      Location: redirectUrl,
      "Cache-Control": "no-cache"
    }
  };
};
