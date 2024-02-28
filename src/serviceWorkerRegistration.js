// This optional code is used to register a service worker.
// register() is not called by default.

import deferredPromise from "./Helpers/deferredPromise";
import { promptForUpdate } from "./Components/Prompt/Prompt";

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

// Checks for Public_url in env, if its not present just assigns .
// const Public_url = process.env.PUBLIC_URL || '.';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.REACT_APP_PUBLIC_URL, window.location.href);
    // console.log("publicUrl", publicUrl);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      // console.log(process.env);
      const swUrl = `${publicUrl.origin}/service-worker.js`;
      // console.log(swUrl);
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then((registration) => {
          console.log(
            'This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

window.waiting = new deferredPromise();
window.installing = new deferredPromise();

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      const UA = navigator.userAgent;
      if (UA.match(/iPhone|iPad|iPod/)) {
        console.log('Safari!!!!');
        if (registration.waiting) {
          window.waiting.resolve(true);
        }
      }
      if (registration.active && !registration.installing) window.installing.resolve(false);
      if (registration.waiting) window.waiting.resolve(true);
      registration.onupdatefound = () => {
        const newWorker = registration.installing || registration.waiting;
        if (newWorker == null) {
          return;
        }
        newWorker.onstatechange = (e) => {
          if (e.target.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // update is available
              window.waiting.resolve(true);
              window.installing.resolve(false);

              // Execute callback
              // if (config && config.onUpdate) {
              //   config.onUpdate(registration);
              // }
              // navigator.serviceWorker.ready.then((registration) => {
              //   console.log("triggering .update()", registration);
              //   registration.update();
              // });

            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // no update is available
              window.waiting.resolve(false);
              window.installing.resolve(false);

              // Execute callback
              // if (config && config.onSuccess) {
              //   config.onSuccess(registration);
              // }
            }
            // newWorker.addEventListener('waiting', (event) => {
            //   console.log("triggered");
            //   showSkipWaitingPrompt(event);
            // });
          };
          return;
        };
        // const showSkipWaitingPrompt = async (event) => {

        //   newWorker.addEventListener('controlling', () => {
        //     window.location.reload();
        //   });
        //   console.log("before prompt try");
        //   try {
        //     console.log("attempting to update service worker??");
        //     console.log("checking on import", await promptForUpdate);
        //     console.log("after promise check");
        //     const updateAccepted = await promptForUpdate;
        //     console.log(updateAccepted);
        //     if (updateAccepted) {
        //       console.log("prompt accepted");
        //       newWorker.messageSkipWaiting();
        //     }
        //   }
        //   catch (err) {
        //     console.log("sw update error", err);
        //   }
        // };
      };
      // checking prompt for updates
      promptForUpdate.then(res => {
        if (res) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        }
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // This fires when the service worker controlling this page
        // changes, eg a new worker has skipped waiting and become
        // the new active worker.
      });
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
