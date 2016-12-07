'use strict'

const scraperjs = require('scraperjs')
const assert = require('assert')
const pMap = require('p-map')
const URL_VIAJES_NACIONALES = 'http://www.senado.cl/appsenado/index.php?mo=transparencia&ac=informeTransparencia&tipo=201&anno=:year:&mesid=:month:'
const URL_VIAJES_INTERNACIONALES = 'http://www.senado.cl/appsenado/index.php?mo=transparencia&ac=informeTransparencia&tipo=200&anno=:year:'

function removeAccent (str) {
  assert.equal(typeof str, 'string', '[senadores-viajes]: Sólo se puede remover acentos de strings')
  return str
          .replace(/á/g, 'a')
          .replace(/é/g, 'e')
          .replace(/í/g, 'i')
          .replace(/ó/g, 'o')
          .replace(/ú/g, 'u')
          .replace(/Á/g, 'A')
          .replace(/É/g, 'E')
          .replace(/Í/g, 'I')
          .replace(/Ó/g, 'O')
          .replace(/Ú/g, 'U')
}

// Remove dots
// (str) -> str
// function removeDots (str) {
//   assert.equal(typeof str, 'string', 'Sólo se puede remover puntos de strings')

//   return str.replace(/\./g, '')
// }

// Wrap a string to prevent search errors for case mismatch and untrimed strings
// (str) -> str
// function wrapString (str) {
//   return str ? removeAccent(removeDots(str)).toUpperCase().trim() : ''
// }

// Convert a period into a valid year
// (date|num) -> num
function getPeriodo (periodo) {
  assert.ok(typeof periodo === 'number' || periodo instanceof Date, '[senadores-viajes]: El periodo ingresado debe ser un número o una fecha.')

  if (typeof periodo === 'number') {
    assert.ok(periodo <= new Date().getFullYear(), '[senadores-viajes]: No se puede consultar por un periodo en el futuro')
    // if period < 2009 -> There might not be info about travels
    if (periodo < 2009) {
      console.warn('[senadores-viajes]: Sólo se tiene información de viajes nacionales posteriores al año 2008, y para viajes internacionales posteriores al 2005')
    }
    return periodo
  }
  if (periodo instanceof Date) {
    assert.ok(periodo.getFullYear() <= new Date().getFullYear(), '[senadores-viajes]: No se puede consultar por un periodo en el futuro')
    return periodo.getFullYear()
  }
}

// Get ofitial national travles for a senator
// (obj, num, num, bool) -> arr
function getViajesNacionales (senador, index, senadores, periodo, incluyeSenador) {
  const urls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
    return URL_VIAJES_NACIONALES.replace(/:year:/, periodo).replace(/:month:/, month)
  })

  const mapper = url => {
    scraperjs.StaticScraper.create()
    .get(url)
    .scrape($ => {
      // get the tr element where the first td child has the name of the senator
      // and the next() td has no text() and also get the next senator, if any,
      // so you have the boundaries of national travels for the current period
      // const limitTrs = $('#main table tr').filter((i, el) => {
      // const first = wrapString($(el).find('td:first-child').text())
      // const second = $(el).find('td:last-child').text().trim()

      // return (first === wrapString(senador.nombre.replace(',', '').toUpperCase()) &&
      //        second === '') ||
      //        (senadores[index + 1] &&
      //          first === wrapString(senadores[index + 1].nombre.replace(',', '').toUpperCase()) && second === '')
      // }).get()
      // console.log(limitTrs)
      // const i = $('#main table tr').index(limitTrs[0])
      // const j = $('#main table tr').index(limitTrs[1])
      // console.log(i, j)
      return {}
    })
  }
  return pMap(urls, mapper)
}

// Get ofitial international travles for a senator
// (obj, num, bool) -> arr
function getViajesExtranjeros (senador, periodo, incluyeSenador) {
  let url = URL_VIAJES_INTERNACIONALES.replace(/:year:/, periodo)

  return scraperjs.StaticScraper.create()
    .get(url)
    .catch(ex => {
      console.log('Some srioues problem happened!\n\n\n')
      return new Promise()
    })
    .scrape($ => {
      const nombre = senador.nombre.split(',')[1].split(' ')[1]
      const apellido = senador.nombre.split(',')[0].split(' ')[0]

      const preResults = $('#main tbody tr:not(:first-child)').filter((i, el) => {
        const _apellido = removeAccent($(el).find('td:nth-child(2)').text().trim())
        const _nombre = removeAccent($(el).find('td:nth-child(4)').text().trim())
        return _nombre.indexOf(removeAccent(nombre).toUpperCase()) > -1 && _apellido.indexOf(removeAccent(apellido).toUpperCase()) > -1
      })

      const results = preResults.map(function () {
        const rubro = $(this).find('td:nth-child(1)').text().trim()
        const dateStr = $(this).find('td:nth-child(5)').text().split('-')
        const month = parseInt(dateStr[1])
        const day = parseInt(dateStr[0])
        const year = parseInt(dateStr[2])
        const fecha = new Date(year, month - 1, day)
        const pais = $(this).find('td:nth-child(6)').text().trim()
        const viatico = parseInt($(this).find('td:nth-child(7)').text().trim())
        const motivo = $(this).find('td:nth-child(8)').text().trim()
        return {
          rubro,
          fecha,
          pais,
          viatico,
          motivo
        }
      }).get()
      return incluyeSenador ? Object.assign(senador, { internacionales: results }) : results
    })
}

exports.getPeriodo = getPeriodo
exports.getViajesNacionales = getViajesNacionales
exports.getViajesExtranjeros = getViajesExtranjeros
