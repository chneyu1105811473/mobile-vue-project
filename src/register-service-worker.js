(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/web/sw.js')
      .then(function () { console.log('Service Worker Registered') })
  }
})()
