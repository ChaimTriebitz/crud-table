const test = require('node:test')
const assert = require('node:assert/strict')
const Bank = require('../models/Bank')

test('bank phone fields are stored as strings', () => {
   assert.equal(Bank.schema.path('cell').instance, 'String')
   assert.equal(Bank.schema.path('office').instance, 'String')
})
