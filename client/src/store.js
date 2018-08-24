import {observable, action, computed} from 'mobx';

export default class Store {
    @observable
    loggedIn = false;

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