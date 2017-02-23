import {Negociacao} from '../models/Negociacao';

export class NegociacaoDao {
    constructor(connection) {
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {
        return new Promise((resolve, reject) => {
            let request = this._connection
                                .transaction([this._store], 'readwrite')
                                .objectStore(this._store)
                                .add(negociacao);

            request.onsuccess = e => resolve();

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível incluir a negociação');
            }
        });
    }

    listaTodos() {
        return new Promise((resolve, reject) => {
            let curso = this._connection
                                .transaction([this._store], 'readwrite')
                                .objectStore(this._store)
                                .openCursor();

            let negociacoes = [];

            curso.onsuccess = e => {
                
                var dados = e.target.result;

                if (dados) {
                    negociacoes.push(dados.value);
                    dados.continue();
                } else {
                    resolve(negociacoes);
                }
            };

            curso.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            };

        });
    }

    apagaTodos() {
        return new Promise((resolve, reject) => {
            let request = this._connection
                                .transaction([this._store], 'readwrite')
                                .objectStore(this._store)
                                .clear();

            request.onsuccess = e => resolve('Negociações apagadas com sucesso');

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível apagar as negociações');
            };                        
        });
    }
}