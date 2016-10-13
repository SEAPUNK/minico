minico
---

[![npm version](https://img.shields.io/npm/v/minico.svg?style=flat-square)](https://npmjs.com/package/minico)
[![javascript standard style](https://img.shields.io/badge/code%20style-standard-blue.svg?style=flat-square)](http://standardjs.com/)
[![travis build](https://img.shields.io/travis/SEAPUNK/minico/master.svg?style=flat-square)](https://travis-ci.org/SEAPUNK/minico)
[![coveralls coverage](https://img.shields.io/coveralls/SEAPUNK/minico.svg?style=flat-square)](https://coveralls.io/github/SEAPUNK/minico)
[![david dependencies](https://david-dm.org/SEAPUNK/minico.svg?style=flat-square)](https://david-dm.org/SEAPUNK/minico)
[![david dev dependencies](https://david-dm.org/SEAPUNK/minico/dev-status.svg?style=flat-square)](https://david-dm.org/SEAPUNK/minico)

It's like [`co`](https://github.com/tj/co), but tiny: Minimal Promise-based coroutines. Performant, with no fluff.

Based off of [`copromise`](https://github.com/deanlandolt/copromise).

`npm install minico`

Relies on Promise being global.

* 592 bytes uncompressed
* 453 bytes minified with uglify-js 2.6.2
* 257 bytes minified with uglify-js 2.6.2, and compressed with gzip 1.8

```js
import minico from 'minico'

const doThings = minico(function * doThings (input) {
  yield washDishes()
  try {
      yield makePopcorn()
  } catch (err) {
      yield someFailureHandler(err)
  }
  return 'nice' + input
})

doThings(2).then((value) => {
  console.log('Coroutune success:', value) // Coroutune success: nice2
}).catch((err) => {
  console.log('An error occured', err)
})

```
