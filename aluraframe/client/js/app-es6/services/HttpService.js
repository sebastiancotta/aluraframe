export class HttpService {

    _handleErrors(res) {
        if (!res.ok) throw new Error(ok.statusText);
        return res;
    }
	
	get(url) {
		return fetch(url)
            .then(res => this._handleErrors(res))
            .then(res => res.json());
	}
	
	post(url, dado) {

        return fetch(url, {
            header: {'Content-type': 'application/json'},
            method: 'post',
            body: JSON.stringify(dado)
        }).then(res => this._handleErrors(res));
		
    }
}