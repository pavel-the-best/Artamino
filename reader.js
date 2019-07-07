const util = require("util");
const fs = require("fs");

const readFile = util.promisify(fs.readFile);

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);

  return string + this;
};

async function read(fileName, args = {}) {
  let data = await readFile(fileName);
  data = data.toString();
  for (let arg in args) {
    for (let i = 0; i < args[arg].length; ++i) {
      if (args[arg][i] === '&') {
        args[arg] = args[arg].insert(i + 1, "amp;");
      }
    }
    for (let i = 0; i < args[arg].length; ++i) {
      if (args[arg][i] === '<') {
        args[arg][i] = '&';
        args[arg] = args[arg].insert(i + 1, "lt;");
      }
    }
    for (let i = 0; i < args[arg].length; ++i) {
      if (args[arg][i] === '<') {
        args[arg][i] = '&';
        args[arg] = args[arg].insert(i + 1, "gt;");
      }
    }
    for (let i = 0; i < args[arg].length; ++i) {
      if (args[arg][i] === '/') {
        args[arg][i] = '&';
        args[arg] = args[arg].insert(i + 1, "#x2F;");
      }
    }
    while (data.search("{{" + arg + "}}") !== -1) {
      data = data.replace("{{" + arg + "}}", args[arg]);
    }
  }
  return data;
}

exports.read = read;
