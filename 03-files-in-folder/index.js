const path = require('path');
const fs = require('fs');
const { error } = require('console');

const folder = path.join(__dirname, '/secret-folder');

fs.promises.readdir(folder, { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      if (filename.isFile) {
        let filePath = path.join(__dirname, '/secret-folder', filename.name);
        fs.stat(`${filePath}`, (error, stats) => {
          if (error) {
            console.log(error);
          } else if (stats.isFile && stats.size !== 0) {
            let output = filename.name.split('.').join(' - ');
            console.log(`${output} - ${stats.size}b`);
          }
        })
      }
    }
  })
    .catch (err => {
      console.log(err);
    })