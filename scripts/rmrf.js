const fs = require('fs');
const { join } = require('path');

module.exports = function rmrf(filePath) {
  if (fs.existsSync(filePath)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((fileName) => {
        rmrf(join(filePath, fileName));
      });
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }
}
