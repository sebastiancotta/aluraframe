'use strict';

System.register(['../models/Negociacao', './HttpService', './ConnectionFactory', '../dao/NegociacaoDao'], function (_export, _context) {
	"use strict";

	var Negociacao, HttpService, ConnectionFactory, NegociacaoDao, _createClass, NegociacaoService;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_modelsNegociacao) {
			Negociacao = _modelsNegociacao.Negociacao;
		}, function (_HttpService) {
			HttpService = _HttpService.HttpService;
		}, function (_ConnectionFactory) {
			ConnectionFactory = _ConnectionFactory.ConnectionFactory;
		}, function (_daoNegociacaoDao) {
			NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
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

			_export('NegociacaoService', NegociacaoService = function () {
				function NegociacaoService() {
					_classCallCheck(this, NegociacaoService);

					this._http = new HttpService();
				}

				_createClass(NegociacaoService, [{
					key: 'obterNegociacoes',
					value: function obterNegociacoes() {
						return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (periodos) {
							var negociacoes = periodos.reduce(function (dados, periodo) {
								return dados.concat(periodo);
							}, []).map(function (dado) {
								return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
							});

							return negociacoes;
						}).catch(function (erro) {
							throw new Error(erro);
						});
					}
				}, {
					key: 'obterNegociacoesDaSemana',
					value: function obterNegociacoesDaSemana() {
						var _this = this;

						return new Promise(function (resolve, reject) {
							_this._http.get('negociacoes/semana').then(function (dados) {
								return resolve(dados.map(function (dado) {
									return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
								}));
							}).catch(function (error) {
								return reject('Não foi possível obter as negociações da semana');
							}); //fim this.http
						});
					}
				}, {
					key: 'obterNegociacoesDaSemanaAnterior',
					value: function obterNegociacoesDaSemanaAnterior() {
						var _this2 = this;

						return new Promise(function (resolve, reject) {

							_this2._http.get('negociacoes/anterior').then(function (dados) {
								return resolve(dados.map(function (dado) {
									return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
								}));
							}).catch(function (erro) {
								return reject('Não foi possível obter as negociações da semana anterior');
							}); //fim this.http
						}); //fim promise
					}
				}, {
					key: 'obterNegociacoesDaSemanaRetrasada',
					value: function obterNegociacoesDaSemanaRetrasada() {
						var _this3 = this;

						return new Promise(function (resolve, reject) {

							_this3._http.get('negociacoes/retrasada').then(function (dados) {
								return resolve(dados.map(function (dado) {
									return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
								}));
							}).catch(function (erro) {
								return reject('Não foi possível obter as negociações da semana retrasada');
							}); //fim this.http
						}); //fim promise
					}
				}, {
					key: 'cadastra',
					value: function cadastra(negociação) {
						return ConnectionFactory.getConnection().then(function (connection) {
							return new NegociacaoDao(connection);
						}).then(function (dao) {
							return dao.adiciona(negociação);
						}).then(function () {
							return 'Negociação cadastrada com sucesso';
						}).catch(function (error) {
							throw new Error('Não foi possível adicionar a negociação');
						});
					}
				}, {
					key: 'lista',
					value: function lista() {
						return ConnectionFactory.getConnection().then(function (conexao) {
							return new NegociacaoDao(conexao);
						}).then(function (dao) {
							return dao.listaTodos();
						}).catch(function (erro) {
							console.log(erro);
							throw new Error('Não foi possível obter as negociações');
						});
					}
				}, {
					key: 'apaga',
					value: function apaga() {
						return ConnectionFactory.getConnection().then(function (connection) {
							return new NegociacaoDao(connection);
						}).then(function (dao) {
							return dao.apagaTodos();
						}).catch(function (erro) {
							console.log(erro);
							throw new Error('Não foi possível obter as negociações');
						});
					}
				}, {
					key: 'importa',
					value: function importa(listaAtual) {
						return this.obterNegociacoes().then(function (negociacoes) {
							return negociacoes.filter(function (negociacao) {
								return !listaAtual.some(function (negociacaoExistente) {
									return negociacao.equals(negociacaoExistente);
								});
							});
						}).catch(function (error) {
							console.log(error);
							throw new Error('Não foi possível importas as negociaçoes');
						});
					}
				}]);

				return NegociacaoService;
			}());

			_export('NegociacaoService', NegociacaoService);
		}
	};
});
//# sourceMappingURL=NegociacaoService.js.map