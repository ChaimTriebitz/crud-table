const fs = require('node:fs')
const path = require('node:path')
const XLSX = require('xlsx')

const inputFile = process.argv[2]
const outputFile = process.argv[3]

if (!inputFile) {
   console.error('Usage: node utils/xlToJson.js <input.xlsx> [output.json]')
   process.exit(1)
}

try {
   const workbook = XLSX.readFile(path.resolve(inputFile))
   const firstSheetName = workbook.SheetNames[0]

   if (!firstSheetName) {
      throw new Error('The workbook does not contain any worksheets')
   }

   const worksheet = workbook.Sheets[firstSheetName]
   const rows = XLSX.utils.sheet_to_json(worksheet)

   if (outputFile) {
      fs.writeFileSync(path.resolve(outputFile), JSON.stringify(rows, null, 2) + '\n')
      console.log(`Converted ${rows.length} rows to ${path.resolve(outputFile)}`)
   } else {
      process.stdout.write(JSON.stringify(rows, null, 2) + '\n')
   }
} catch (error) {
   console.error(`Could not convert spreadsheet: ${error.message}`)
   process.exitCode = 1
}
