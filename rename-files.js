
const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const dir = args[0]
const match = RegExp(args[1], 'g')
const replace = args[2]
const files = fs.readdirSync(dir);

files.filter(function(file) {
  return file.match(match);
}).forEach(function(file) {
  var filePath = path.join(dir, file),
    newFilePath = path.join(dir, file.replace(match, replace));

  fs.renameSync(filePath, newFilePath);
});
