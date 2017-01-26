let vapidPublicKey = null;
let convertedVapidKey = null;
let subscribe = null;

window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
    navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then((sub) => {
            if (!sub) {
                document.getElementById('sub').disabled = false;
            } else {
                subscribe = sub;
                document.getElementById('unsub').disabled = false;
                document.getElementById('push').disabled = false;
            }
        })
    })
    fetch('./key')
        .then((res) => res.text())
        .then((str) => {
            vapidPublicKey = str;
            convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        })
        .then(() => {
            Notification.requestPermission((permission) => {
                if (permission === 'denied') {
                    console.log('denied');
                }
            })
        })
    /*
    vapidPublicKey = 'BGakNnudB3hkYbzS8s8pGssDDjROBYzoARITFbV3DhVcZKZ2Sr9Ha3EhjLIP92eV4UA3Y2K_gEGadql5robFp9g';
    convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    */

})
document.getElementById('sub').addEventListener('click', () => {
    navigator.serviceWorker.ready
        .then((reg) => {
            if (!convertedVapidKey) {
                console.log('applicationServerKey is Not Found');
                return;
            }
            let opt = {
                //userVisible: true,
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            }
            reg.pushManager.getSubscription().then((sub) => {
                if (sub) {
                    subscribe = sub;
                    return;
                }
                reg.pushManager.subscribe(opt)
                    .then((sub) => {
                        subscribe = sub;
                        document.getElementById('unsub').disabled = false;
                        document.getElementById('sub').disabled = true;
                        document.getElementById('push').disabled = false;
                    })
            })

        }, false)
})
document.getElementById('unsub').addEventListener('click', () => {
    navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
                sub.unsubscribe();
                document.getElementById('unsub').disabled = true;
                document.getElementById('sub').disabled = false;
            }
        })
    })
})
document.getElementById('push').addEventListener('click', () => {
    if (!subscribe) {
        console.log('not Sub')
        return;
    }
    const title = document.getElementById('title').value
    const body = document.getElementById('body').value
    const auth = urlUnit8ArrayToBase64URL(new Uint8Array(subscribe.getKey('auth')));
    const pKey = urlUnit8ArrayToBase64URL(new Uint8Array(subscribe.getKey('p256dh')));
    const opt = {
        message: {
            title: title,
            body: body
        },
        endpoint: subscribe.endpoint,
        key: pKey,
        auth: auth,
        jwt: {
            aud: new URL(subscribe.endpoint).origin,
            sub: location.href
        }
    };


    fetch('./test', {
        method: 'POST',
        body: JSON.stringify(opt),
        headers: { 'Content-Type': 'application/json' }
    }).then((resp) => {
        console.log(resp)
    })


})
function urlUnit8ArrayToBase64URL(unit) {
    return btoa(String.fromCharCode.apply(null, unit)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

