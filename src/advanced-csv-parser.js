const {
  INVALID_JSON_DATA,
  INVALID_HEADER_TRANSFORMER,
} = require('../utils/config');
const fs = require('fs');

const repeat = (value, times, delimiter) => {
  const result = [];

  while (result.length < times) {
    if (times - result.length > 1) {
      result.push(`${value}${delimiter}`);
    } else {
      result.push(value);
    }
  }

  return result.join('');
};

const convertJSONToCSV = (
  inputObj,
  { withHeaders = true, delimiter = ',', defaultValue = '' } = {}
) => {
  if (
    Array.isArray(inputObj) &&
    ((withHeaders && inputObj.length > 1) || inputObj.length > 0)
  ) {
    let headers = Object.keys(inputObj[0]);
    let result = inputObj.map((obj) => {
      const objKeys = Object.keys(obj);

      if (
        objKeys.length !== headers.length ||
        JSON.stringify(objKeys) !== JSON.stringify(headers)
      ) {
        headers = Array.from(new Set([...headers, ...objKeys]));
      }
      const newObj = headers.map(
        (header) => obj[header] || String(defaultValue)
      );

      return newObj.join(delimiter);
    });

    result = result
      .map((row) => {
        let elements = row.split(delimiter);

        if (elements.length !== headers.length) {
          elements.push(
            repeat(defaultValue, headers.length - elements.length, delimiter)
          );
          return elements.join(delimiter);
        }
        return row;
      })
      .join('\n');

    if (withHeaders) {
      result = `${headers.join(delimiter)}\n${result}`;
    }

    return result;
  } else {
    return INVALID_JSON_DATA;
  }
};

const convertCSVToJSON = (
  inputCSV,
  {
    withHeaders = true,
    delimiter = ',',
    defaultValue = '',
    headers = null,
  } = {}
) => {
  const rows = inputCSV.split('\n');

  let keys = [];

  if (withHeaders) {
    const dataHeaders = rows.shift().split(delimiter);
    try {
      keys = headers ? headers(dataHeaders) : dataHeaders;
    } catch (exception) {
      keys = dataHeaders;
      console.log(INVALID_HEADER_TRANSFORMER);
    }
  }

  const result = rows.map((row) => {
    const values = row.split(delimiter);
    return withHeaders
      ? Object.assign(
          {},
          ...Array.from(
            values,
            (value, i) => value !== defaultValue && { [keys[i]]: value }
          )
        )
      : Object.assign(
          {},
          values.filter((value) => value !== defaultValue)
        );
  });

  return result;
};

const convertJSONFileToCSV = (filePath, opts) => {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return convertJSONToCSV(JSON.parse(fileData), opts);
};

const convertCSVFileToJSON = (filePath, opts) => {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return convertCSVToJSON(fileData, opts);
};

const convertCSVFileToJSONAsync = (filePath, opts) => {
  const fileReadStream = fs.createReadStream(filePath);
  fileReadStream.on('data', (data) => {
    console.log(data.toString());
  })
};

module.exports = {
  convertJSONToCSV,
  convertCSVToJSON,
  convertJSONFileToCSV,
  convertCSVFileToJSON,
  convertCSVFileToJSONAsync
};
