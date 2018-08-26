import {BASE} from './index';

import store from '../store';

export default async () => {
  console.log('opened');
  window.open(`${BASE}/api/auth/login`);

  let once;

  window.addEventListener('message', event => {
    if (once || event.origin !== BASE) return;

    once = true;

    const jwt = event.data;

    store.logIn(jwt);

    window.location.reload();
  });
}
