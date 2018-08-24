import {observable, action, computed} from 'mobx';

export default class Store {
    @observable
    loggedIn = false;
}