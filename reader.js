const util = require("util");
const fs = require("fs");

const readFile = util.promisify(fs.readFile);

async function read(fileName, args={}) {
    let data = await readFile(fileName);
    data = data.toString();
    for (let arg in args) {
        while (data.search("{{" + arg + "}}") !== -1) {
            data = data.replace("{{" + arg + "}}", args[arg]);
        }
    }
    return data;
}

exports.read = read;
