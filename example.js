const viajes = require('./')

viajes('Zaldívar', { tipo: 'extranjeros' })
  .then(s => console.log(s))
