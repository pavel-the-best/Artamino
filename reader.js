const util = require("util");
const fs = require("fs");
const escaper = require("./escaper.js");

const fsReadFile = util.promisify(fs.readFile);
const fsAccess = util.promisify(fs.access);

async function fileExists(filePath) {
  try {
    await fsAccess(filePath);
    return true;
  } catch(err) {
    return false;
  }
}

async function read(filePath, args = {}) {
  let data = await fsReadFile(filePath);
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
exports.fileExists = fileExists;
