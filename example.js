const viajes = require('./')

viajes('Moreira', { tipo: 'extranjeros' })
  .then(s => console.log(s))
