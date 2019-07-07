function replaceSymbol(string, symbol, replacement) {
  for (let i = 0; i < string.length; ++i) {
    if (string[i] === symbol) {
      string = string.substring(0, i) + replacement + string.substring(i, string.length);
      i += replacement.length - 1;
    }
  }
  return string;
}

function escape(string) {
  string = replaceSymbol(string, '&', "&amp;");
  string = replaceSymbol(string, '<', "&lt;");
  string = replaceSymbol(string, '>', "&gt;");
  string = replaceSymbol(string, '"', "&quot;");
  string = replaceSymbol(string, '\'', "&#x27;");
  string = replaceSymbol(string, '/', "&#x2F");
  return string;
}

exports.escape = escape;