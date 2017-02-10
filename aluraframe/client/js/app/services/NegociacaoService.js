class NegociacaoService {
	
	constructor () {
		this._http = new HttpService();
	}
	
	obterNegociacoes() {
		return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()])
			.then(periodos => {
				let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

				return negociacoes;
			})
			.catch(erro => {throw new Error(erro)});
	}

	obterNegociacoesDaSemana() {

			return new Promise((resolve, reject) => {
				this._http.get('negociacoes/semana')
				.then(dados => resolve(dados.map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
				.catch(error => reject('Não foi possível obter as negociações da semana'));//fim this.http
			});
	}
	
	obterNegociacoesDaSemanaAnterior() {

        return new Promise((resolve, reject) => {

            this._http.get('negociacoes/anterior')
                .then(dados => resolve(dados.map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
                .catch(erro => reject('Não foi possível obter as negociações da semana anterior'));//fim this.http

        });//fim promise
    }//fim obterNegociacoesDaSemanaAnterior()

    obterNegociacoesDaSemanaRetrasada() {

        return new Promise((resolve, reject) => {

            this._http.get('negociacoes/retrasada')
                .then(dados => resolve(dados.map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor))))
                .catch(erro => reject('Não foi possível obter as negociações da semana retrasada'));//fim this.http

        });//fim promise
    }//fim obterNegociacoesDaSemanaRetrasada() 

	cadastra(negociação) {
		return ConnectionFactory
			.getConnection()
			.then(connection =>
				new NegociacaoDao(connection))
			.then(dao => 
				dao.adiciona(negociação))
			.then(() => 'Negociação cadastrada com sucesso')	
			.catch(error => {
				throw new Error('Não foi possível adicionar a negociação');
			});	
	}

	lista() {
		return ConnectionFactory
					.getConnection()
					.then(conexao => new NegociacaoDao(conexao))
					.then(dao => dao.listaTodos())					
					.catch(erro => {
						console.log(erro);
						throw new Error('Não foi possível obter as negociações');
					});
	}

	apaga() {
		return ConnectionFactory
			.getConnection()
			.then(connection => new NegociacaoDao(connection))
			.then(dao => dao.apagaTodos())
			.catch(erro => {
				console.log(erro);
				throw new Error('Não foi possível obter as negociações');
			});
	}

	importa(listaAtual) {
		this.obterNegociacoes()
			.then(negociacoes => negociacoes.filter(negociacao => 
				!this._listaNegociacoes.negociacoes
					.some(negociacaoExistente => 
					JSON.stringify(negociacaoExistente) == JSON.stringify(negociacao))))
			.catch(error =>{
				console.log(error);
				throw new Error('Não foi possível importas as negociaçoes');
			});		
	}

}