const util = require("util");
const fs = require("fs");

const readFile = util.promisify(fs.readFile);

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  return string + this;
};

function replaceSymbol(string, symbol, replacement) {
  for (let i = 0; i < string.length; ++i) {
    if (string[i] === symbol) {
      string = string.substring(0, i) + replacement[0] + string.substring(i + 1, string.length);
      string = string.insert(i + 1, replacement.substring(1, replacement.length));
      i += replacement.length - 1;
    }
  }
  return string;
}

async function read(fileName, args = {}) {
  let data = await readFile(fileName);
  data = data.toString();
  for (let arg in args) {
    args[arg] = replaceSymbol(args[arg], '&', "&amp;");
    args[arg] = replaceSymbol(args[arg], '<', "&lt;");
    args[arg] = replaceSymbol(args[arg], '>', "&gt;");
    args[arg] = replaceSymbol(args[arg], '/', "&#x2F;");
    args[arg] = replaceSymbol(args[arg], '"', "&quot;");
    args[arg] = replaceSymbol(args[arg], '\'', "&#x27;");
    while (data.search("{{" + arg + "}}") !== -1) {
      data = data.replace("{{" + arg + "}}", args[arg]);
    }
  }
  return data;
}

exports.read = read;
