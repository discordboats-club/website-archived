class Store {
    loggedIn = true;

    authtoken = 'none';
    
    logIn = (token) => {
        console.log(this.authtoken);
        console.log(token);

        this.authtoken = token;
        this.loggedIn = true
    }

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
