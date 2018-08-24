import {observable, action} from 'mobx';

import { create, persist } from 'mobx-persist';

class Store {
    @persist('boolean')
    @observable
    loggedIn = true;

    @persist('string')
    @observable
    token = null;

    @action
    logIn(token) {
        this.token = token;
        this.loggedIn = true
    }

    @action
    logOut() {
        this.token = '';
        this.loggedIn = false;
    }
}

const hydrate = create();

hydrate('store', Store).then(() => {console.log('Store hydrated');});

export default new Store();