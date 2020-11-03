import 'regenerator-runtime/runtime'
// mocha will be global
require("mocha")
const chai = require("chai")
// we need a global "expect" function too
window.expect = chai.expect
mocha.setup("bdd")
