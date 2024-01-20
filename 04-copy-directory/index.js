const fs = require('fs');
const path = require('path');


fs.mkdir(path.join(__dirname, '/files-copy'), { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
})

fs.promises.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      fs.unlink(path.join(__dirname, 'files-copy', filename.name), (err) => {
        if (err) {
          console.log(err);
        }
      })
    }
  })

fs.promises.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      let src = path.join(__dirname, 'files', filename.name);
      let dest = path.join(__dirname, 'files-copy', filename.name);
      fs.copyFile(src, dest, fs.constants.COPYFILE_FICLONE, (err) => {
        if (err) {
          console.log('Error Found:', err);
        }
      })
    }
  }) 