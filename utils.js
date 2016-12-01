'use strict'

const scraperjs = require('scraperjs')
const URL_VIAJES_NACIONALES = ''
const URL_VIAJES_INTERNACIONALES = ''

// Convert a period into a valid year
// (date|num) -> num
function getPeriodo (period) {

}

// Get ofitial national travles for a senator
// (obj, num, bool) -> arr
function getViajesNacionales (senador, periodo, incluyeSenador) {
  let url = URL_VIAJES_NACIONALES.replace(/:senador-id:/, senador.id)

  return scraperjs.StaticScraper.create()
    .get(url)
    .scrape($ => {
      return {}
    })
}

// Get ofitial international travles for a senator
// (obj, num, bool) -> arr
function getViajesInternacionales (senador, periodo, incluyeSenador) {
  let url = URL_VIAJES_INTERNACIONALES.replace(/:senador-id:/, senador.id)

  return scraperjs.StaticScraper.create()
    .get(url)
    .scrape($ => {
      return {}
    })
}

exports.getPeriodo = getPeriodo
exports.getViajesNacionales = getViajesNacionales
exports.getViajesInternacionales = getViajesInternacionales
