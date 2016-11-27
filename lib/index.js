'use strict'

function spawn (coroutine) {
  return new Promise(function (resolve, reject) {
    (function next (val, err) {
      var result
      try {
        result = err ? coroutine.throw(err) : coroutine.next(val)
      } catch (err) {
        return reject(err)
      }

      if (result.done) return resolve(result.value)

      Promise.resolve(result.value).then(next).catch(function (err) {
        next(null, err)
      })
    })()
  })
}

function minico (coroutine) {
  return function () {
    return spawn(coroutine.apply(this, arguments))
  }
}

minico.run = function (coroutine) {
  return minico(coroutine)()
}

module.exports = minico['default'] = minico.minico = minico
