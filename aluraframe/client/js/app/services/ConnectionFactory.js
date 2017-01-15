
var store = ['negociacoes'];
var version = 4;
var dbName = 'aluraframe' 

class ConnectionFactory {
    constructor() {
        throw new Error('ConnectionFactory não pode ser instanciada');
    }

    static getConnection() {
        return new Promise((resolve, reject) => {
            let openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = e => {

            };

            openRequest.onsuccess = e => {

            };

            openRequest.onerror = e => {

            };

        });
    }
}