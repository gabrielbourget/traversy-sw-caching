// -> Make sure service workers are supported in the browser
if ('serviceWorker' in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../sw_cached_site.js")
      .then((regObj) => console.log(regObj))
      .catch(err => console.log(`Service worker: Error: ${err}`));
  });
}