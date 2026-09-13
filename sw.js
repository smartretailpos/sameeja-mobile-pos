const CACHE_NAME =
  'sameeja-mobile-pos-v1';

const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];


/*
 * INSTALL
 */
self.addEventListener(
  'install',
  function (event) {

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(
          function (cache) {

            return cache.addAll(
              APP_FILES
            );

          }
        )
        .then(
          function () {

            return self.skipWaiting();

          }
        )
    );

  }
);


/*
 * ACTIVATE
 */
self.addEventListener(
  'activate',
  function (event) {

    event.waitUntil(
      caches
        .keys()
        .then(
          function (keys) {

            return Promise.all(
              keys.map(
                function (key) {

                  if (
                    key !== CACHE_NAME
                  ) {

                    return caches.delete(
                      key
                    );

                  }

                }
              )
            );

          }
        )
        .then(
          function () {

            return self.clients.claim();

          }
        )
    );

  }
);


/*
 * FETCH
 */
self.addEventListener(
  'fetch',
  function (event) {

    if (
      event.request.method !==
      'GET'
    ) {

      return;

    }


    const requestUrl =
      new URL(
        event.request.url
      );


    /*
     * External websites, including
     * Google Apps Script POS,
     * must not be intercepted.
     */
    if (
      requestUrl.origin !==
      self.location.origin
    ) {

      return;

    }


    /*
     * Navigation
     */
    if (
      event.request.mode ===
      'navigate'
    ) {

      event.respondWith(
        fetch(
          event.request
        )
          .catch(
            function () {

              return caches.match(
                './index.html'
              );

            }
          )
      );

      return;

    }


    /*
     * Local assets
     */
    event.respondWith(
      caches
        .match(
          event.request
        )
        .then(
          function (
            cachedResponse
          ) {

            if (
              cachedResponse
            ) {

              return cachedResponse;

            }


            return fetch(
              event.request
            );

          }
        )
    );

  }
);
