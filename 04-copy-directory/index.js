const fs = require('fs');
const path = require('path');

async function main() {
  try {
    await fs.promises.mkdir(path.join(__dirname, '/files-copy'), { recursive: true });
    await fs.promises.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true })
      .then(filenames => {
        for (let filename of filenames) {
          fs.promises.unlink(path.join(__dirname, 'files-copy', filename.name));
        }
      })

    await fs.promises.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
      .then(filenames => {
        for (let filename of filenames) {
          let src = path.join(__dirname, 'files', filename.name);
          let dest = path.join(__dirname, 'files-copy', filename.name);
          fs.copyFile(src, dest, fs.constants.COPYFILE_FICLONE, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
  })
  }
  catch (err) {
    console.log(err);
  }
}

main();