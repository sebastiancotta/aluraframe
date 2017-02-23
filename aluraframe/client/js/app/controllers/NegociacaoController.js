'use strict';

System.register(['../helpers/Bind', '../services/NegociacaoService', '../models/Mensagem', '../views/MensagemView', '../models/Negociacao', '../views/NegociacoesView', '../models/ListaNegociacoes', '../helpers/DateHelper'], function (_export, _context) {
	"use strict";

	var Bind, NegociacaoService, Mensagem, MensagemView, Negociacao, NegociacoesView, ListaNegociacoes, DateHelper, _createClass, NegociacaoController;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_helpersBind) {
			Bind = _helpersBind.Bind;
		}, function (_servicesNegociacaoService) {
			NegociacaoService = _servicesNegociacaoService.NegociacaoService;
		}, function (_modelsMensagem) {
			Mensagem = _modelsMensagem.Mensagem;
		}, function (_viewsMensagemView) {
			MensagemView = _viewsMensagemView.MensagemView;
		}, function (_modelsNegociacao) {
			Negociacao = _modelsNegociacao.Negociacao;
		}, function (_viewsNegociacoesView) {
			NegociacoesView = _viewsNegociacoesView.NegociacoesView;
		}, function (_modelsListaNegociacoes) {
			ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
		}, function (_helpersDateHelper) {
			DateHelper = _helpersDateHelper.DateHelper;
		}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			_export('NegociacaoController', NegociacaoController = function () {
				function NegociacaoController() {
					_classCallCheck(this, NegociacaoController);

					var $ = document.querySelector.bind(document);
					this._data = $("#data");
					this._quantidade = $("#quantidade");
					this._valor = $("#valor");

					this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');
					this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', 'inverteOrdem');
					this._negociacaoService = new NegociacaoService();
					this._ordemAtual = ''; // quando a página for carregada, não tem critério. Só passa a ter quando ele começa a clicar nas colunas

					this._init();
				}

				_createClass(NegociacaoController, [{
					key: '_init',
					value: function _init() {
						var _this = this;

						this._negociacaoService.lista().then(function (negociacoes) {
							return negociacoes.forEach(function (dado) {
								return _this._listaNegociacoes.adiciona(new Negociacao(dado._data, dado._quantidade, dado._valor));
							});
						}).catch(function (erro) {
							return _this._mensagem.texto = erro;
						});
						setInterval(function () {
							console.log('Importando negociações');
							_this.importaNegociacoes();
						}, 3000);
					}
				}, {
					key: 'ordena',
					value: function ordena(coluna) {
						if (this._ordemAtual == coluna) {
							this._listaNegociacoes.inverteOrdem();
						} else {
							this._listaNegociacoes.ordena(function (a, b) {
								return a[coluna] - b[coluna];
							});
						}
						this._ordemAtual = coluna;
					}
				}, {
					key: 'adicionar',
					value: function adicionar(event) {
						var _this2 = this;

						event.preventDefault();

						var negociacao = this._criaNegociacao();

						this._negociacaoService.cadastra(negociacao).then(function (mensagem) {
							_this2._listaNegociacoes.adiciona(negociacao);
							_this2._mensagem.texto = mensagem;
							_this2._limpaCampos();
						}).catch(function (error) {
							return _this2._mensagem.texto = error;
						});
					}
				}, {
					key: 'importaNegociacoes',
					value: function importaNegociacoes() {
						var _this3 = this;

						this._negociacaoService.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
							return negociacoes.forEach(function (negociacao) {
								_this3._listaNegociacoes.adiciona(negociacao);
								_this3._mensagem.texto = 'Negociações do período importadas';
							});
						}).catch(function (erro) {
							return _this3._mensagem.texto = erro;
						});
					}
				}, {
					key: 'apaga',
					value: function apaga() {
						var _this4 = this;

						this._negociacaoService.apaga().then(function (mensagem) {
							_this4._mensagem.texto = mensagem;
							_this4._listaNegociacoes.esvazia();
						}).catch(function (error) {
							return _this4._mensagem.texto = error;
						});
					}
				}, {
					key: '_criaNegociacao',
					value: function _criaNegociacao() {
						return new Negociacao(DateHelper.textoParaData(this._data.value), parseInt(this._quantidade.value), parseFloat(this._valor.value));
					}
				}, {
					key: '_limpaCampos',
					value: function _limpaCampos() {
						this._data.value = '';
						this._quantidade.value = 1;
						this._valor.value = 0.0;
					}
				}]);

				return NegociacaoController;
			}());

			_export('NegociacaoController', NegociacaoController);
		}
	};
});
//# sourceMappingURL=NegociacaoController.js.map