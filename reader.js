const util = require("util");
const fs = require("fs");
const escaper = require("./escaper.js");

const readFile = util.promisify(fs.readFile);

async function read(fileName, args = {}) {
  let data = await readFile(fileName);
  data = data.toString();
  for (let arg in args) {
    args[arg] = escaper.escape(args[arg]);
    while (data.search("{{" + arg + "}}") !== -1) {
      data = data.replace("{{" + arg + "}}", args[arg]);
    }
  }
  return data;
}

exports.read = read;
