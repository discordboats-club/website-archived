import {observable, action} from 'mobx';

class Store {
    @observable
    loggedIn = true;

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

export default new Store();