const path = require('path');
const fs = require('fs');

const stylesPath = path.join(__dirname, 'styles');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.promises.readdir(stylesPath)
  .then(files => {
    for (let file of files) {
      if (path.extname(file) === '.css') {
        let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
        readableStream.on('data', (chunk) => output.write(chunk));
      }
    }
  })