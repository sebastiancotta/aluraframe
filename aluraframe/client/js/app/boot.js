'use strict';

System.register(['./controllers/NegociacaoController'], function (_export, _context) {
  "use strict";

  var NegociacaoController, negociacaoController;
  return {
    setters: [function (_controllersNegociacaoController) {
      NegociacaoController = _controllersNegociacaoController.NegociacaoController;
    }],
    execute: function () {
      negociacaoController = new NegociacaoController();


      document.querySelector('.form').onsubmit = negociacaoController.adicionar.bind(negociacaoController);
      document.querySelector('button[type=button]').onclick = negociacaoController.apaga.bind(negociacaoController);
    }
  };
});
//# sourceMappingURL=boot.js.map