class View {
	
	constructor(elemento) {
		this._elemento = elemento;
	}
	
	template() {
		throw new Error('Você deve sobrescrever este método em seu template');
	}
	
	update(model) {
		this._elemento.innerHTML = this.template(model);
	}
	
}