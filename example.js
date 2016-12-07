const viajes = require('./')

viajes('Zaldívar', { tipo: 'extranjeros', periodo: 2016, incluyeSenador: true })
  .then(s => console.log(s))
