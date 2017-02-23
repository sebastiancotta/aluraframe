import {Bind} from '../helpers/Bind';
import {NegociacaoService} from '../services/NegociacaoService';
import {Mensagem} from '../models/Mensagem';
import {MensagemView} from '../views/MensagemView';
import {Negociacao} from '../models/Negociacao';
import {NegociacoesView} from '../views/NegociacoesView';
import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {DateHelper} from '../helpers/DateHelper';

export class NegociacaoController {
	constructor() {
		let $ = document.querySelector.bind(document);
		this._data = $("#data");
		this._quantidade = $("#quantidade");
		this._valor = $("#valor");
				
		this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');
		this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');		
		this._negociacaoService = new NegociacaoService();
		this._ordemAtual = ''; // quando a página for carregada, não tem critério. Só passa a ter quando ele começa a clicar nas colunas

		this._init();
	}

	_init() {
		this._negociacaoService
				.lista()
				.then(negociacoes => 
					negociacoes.forEach(dado => 
							 this._listaNegociacoes.adiciona(
                    		 new Negociacao(dado._data, dado._quantidade, dado._valor))))
				.catch(erro => this._mensagem.texto = erro);
		setInterval(() => {
			console.log('Importando negociações');
			this.importaNegociacoes();
		}, 3000)					

	}
	
	ordena(coluna) {
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);    
        }
        this._ordemAtual = coluna;
	}
	
	adicionar(event) {
		event.preventDefault();
					
		let negociacao = this._criaNegociacao();

		this._negociacaoService		
			.cadastra(negociacao)
			.then(mensagem => {
				this._listaNegociacoes.adiciona(negociacao);
				this._mensagem.texto = mensagem;
				this._limpaCampos();
			}).catch(error => this._mensagem.texto = error);
	}
	
	importaNegociacoes() {
        this._negociacaoService
			.importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas';   
            }))
            .catch(erro => this._mensagem.texto = erro); 
	}
	
	apaga() {		
			this._negociacaoService
			.apaga()
			.then(mensagem => {
				this._mensagem.texto = mensagem;
				this._listaNegociacoes.esvazia();
			}).catch(error => this._mensagem.texto = error);

	}
	
	_criaNegociacao() {
        return new Negociacao(
                DateHelper.textoParaData(this._data.value),
				parseInt(this._quantidade.value),
				parseFloat(this._valor.value)
            );   
    }
	
	_limpaCampos() {
		this._data.value = '';
		this._quantidade.value = 1;
		this._valor.value = 0.0;
	}
}