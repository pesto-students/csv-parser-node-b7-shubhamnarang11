const {
  convertJSONToCSV,
  convertCSVToJSON,
  convertJSONFileToCSV,
  convertCSVFileToJSON,
  convertCSVFileToJSONAsync,
} = require('..');
const { SAMPLE_JSON_DATA } = require('./data');
const PATH = require('path');

// console.log(convertJSONToCSV(SAMPLE_JSON_DATA, { defaultValue: 0 }));

// console.log(
//   convertCSVToJSON(convertJSONToCSV(SAMPLE_JSON_DATA), {
//     withHeaders: true,
//     headers: (header) => header.map((column) => JSON.parse(column)),
//   })
// );

// console.log(convertJSONFileToCSV(PATH.resolve('./utils/todos.json')));

console.log(convertCSVFileToJSONAsync(PATH.resolve('./utils/todos.csv')));
