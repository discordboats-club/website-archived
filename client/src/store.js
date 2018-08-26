import {observable, action} from 'mobx';

import { create, persist } from 'mobx-persist';

class Store {
    @persist('boolean')
    @observable
    loggedIn = true;

    @persist('string')
    @observable
    authtoken = 'none';

    @action
    logIn = (token) => {
        console.log(this.authtoken);
        console.log(token);

        this.authtoken = token;
        this.loggedIn = true
    }

    @action
    logOut = () => {
        this.authtoken = '';
        this.loggedIn = false;
    }
}

const hydrate = create({
  jsonify: true
});

hydrate('store', Store).then(() => {console.log('Store hydrated');});

export default new Store();
