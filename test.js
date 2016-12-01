import test from 'ava'
import senadoresViajes from './'

test('senadores-viajes does something awesome', async t => {
  t.plan(1)

  const viajes = await senadoresViajes()
  t.is(typeof viajes, 'object')
})
