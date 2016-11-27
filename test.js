import test from 'ava'

import delay from 'delay'

import minico, { run } from './'

const genfn = function * (a, b) {
  let isCaught = false

  if (a === 'hardfail1') {
    yield Promise.reject(new Error('hardfail - 1'))
  }

  if (a === 'hardfail2') {
    return Promise.reject(new Error('hardfail - 2'))
  }

  if (a === 'hardfail3') {
    throw new Error('hardfail - 3')
  }

  const retV = yield 'a'
  if (retV !== 'a') {
    throw new Error('retV is not a!')
  }

  const retP = yield Promise.resolve(100)
  if (retP !== 100) {
    throw new Error('retP is not 100!')
  }

  if (b === 'stop') {
    yield delay(100)
    return yield Promise.resolve('ok')
  }

  try {
    if (a === 'fail') {
      yield Promise.reject(new Error('a is fail'))
    } else {
      yield Promise.resolve()
    }
  } catch (err) {
    if (String(err) !== 'Error: a is fail') throw err
    isCaught = true
  }

  return [a, b, isCaught]
}

test('normal, non-caught', async (t) => {
  t.plan(1)
  const coroutine = minico(genfn)
  const retval = await coroutine(1, 2)
  t.deepEqual(retval, [1, 2, false])
})

test('normal, caught', async (t) => {
  t.plan(1)
  const coroutine = minico(genfn)
  const retval = await coroutine('fail', 2)
  t.deepEqual(retval, ['fail', 2, true])
})

test('stopped early, with 100ms delay', async (t) => {
  t.plan(2)
  const coroutine = minico(genfn)
  const startTime = Date.now()
  const retval = await coroutine(1, 'stop')
  t.is(retval, 'ok')
  t.is(true, (
    Date.now() - startTime > 100
  ))
})

test('rejection - yield rejected promise', async (t) => {
  t.plan(1)

  const coroutine = minico(genfn)

  try {
    await coroutine('hardfail1', 2)
  } catch (err) {
    t.is(String(err), 'Error: hardfail - 1')
    return
  }

  throw new Error('coroutine did not throw')
})

test('rejection - return rejected promise', async (t) => {
  t.plan(1)

  const coroutine = minico(genfn)

  try {
    await coroutine('hardfail2', 2)
  } catch (err) {
    t.is(String(err), 'Error: hardfail - 2')
    return
  }

  throw new Error('coroutine did not throw')
})

test('rejection - throw error', async (t) => {
  t.plan(1)

  const coroutine = minico(genfn)

  try {
    await coroutine('hardfail3', 2)
  } catch (err) {
    t.is(String(err), 'Error: hardfail - 3')
    return
  }

  throw new Error('coroutine did not throw')
})

test('minico.run helper', async (t) => {
  t.plan(1)
  const retval = await run(function * () {
    return yield Promise.resolve('ok')
  })
  t.is(retval, 'ok')
})

