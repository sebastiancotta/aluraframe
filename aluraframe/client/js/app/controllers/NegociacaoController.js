class NegociacaoController {
	constructor() {
		let $ = document.querySelector.bind(document);
		this._data = $("#data");
		this._quantidade = $("#quantidade");
		this._valor = $("#valor");
				
		this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');
		this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');		
		this._negociacaoService = new NegociacaoService();
		this._ordemAtual = ''; // quando a página for carregada, não tem critério. Só passa a ter quando ele começa a clicar nas colunas
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
					
		this._listaNegociacoes.adiciona(this._criaNegociacao());
	    // nova mensagem e atualizado a view
        this._mensagem.texto = 'Negociação adicionada com sucesso';
		this._limpaCampos();
		this._data.focus();	
	}
	
	importaNegociacoes() {
        this._negociacaoService
            .obterNegociacoes()
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'   
            }))
            .catch(erro => this._mensagem.texto = erro); 
	}
	
	apaga() {
		
		this._listaNegociacoes.esvazia();
		
		// exibe uma nova mensagem
		this._mensagem.texto = "Negociações removidas com sucesso";
	}
	
	_criaNegociacao() {
        return new Negociacao(
                DateHelper.textoParaData(this._data.value),
                this._quantidade.value,
                this._valor.value
            );   
    }
	
	_limpaCampos() {
		this._data.value = '';
		this._quantidade.value = 1;
		this._valor.value = 0.0;
	}
}