
export default function deferredPromise() {
  let resolve;
  let reject;
  const promise = new Promise((thisResolve, thisReject) => {
    resolve = thisResolve;
    reject = thisReject;
  });

  return Object.assign(promise, { resolve, reject });
};