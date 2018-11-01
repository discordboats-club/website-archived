class Store {
    loggedIn = true;

    authtoken = 'none';   
}

/*
const hydrate = create({
  jsonify: true
});

hydrate('store', Store).then(() => {console.log('Store hydrated');});
*/

export default new Store();
