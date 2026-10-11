const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const XLSX = require('xlsx')
const { convertWorkbook } = require('../utils/xlToJson')

test('converts the first worksheet into JSON rows', (t) => {
   const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vito-xlsx-test-'))
   t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

   const workbook = XLSX.utils.book_new()
   const rows = [
      { bank: 'Example Bank', contact: 'Sample Contact' },
      { bank: 'Community Bank', contact: 'Another Contact' }
   ]
   const worksheet = XLSX.utils.json_to_sheet(rows)
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Banks')

   const inputFile = path.join(tempDir, 'input.xlsx')
   const outputFile = path.join(tempDir, 'output.json')
   XLSX.writeFile(workbook, inputFile)

   assert.deepEqual(convertWorkbook(inputFile, outputFile), rows)
   assert.deepEqual(JSON.parse(fs.readFileSync(outputFile, 'utf8')), rows)
})

test('requires an input file path', () => {
   assert.throws(() => convertWorkbook(), /input spreadsheet path is required/)
})
