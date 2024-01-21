const path = require('path');
const fs = require('fs');

const stylePath = path.join(__dirname, 'styles');
const outputStyle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));


// Удаляем старые файлы, если в папке что-то есть
function clearDirectory(directory) {
  fs.promises.readdir(directory, { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      let directoryPath = path.join(directory, filename.name);
      if (filename.isFile()) {
        fs.unlink(directoryPath, (err) => {
        if (err) {
          console.log(err);
        }
      })
      } else {
        clearDirectory(directoryPath);
      }
    }
  })
}

// Копируем ассеты

function copyDirectory(src, out) {
  fs.mkdir(out, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  })
  fs.promises.readdir(src, { withFileTypes: true }, (err) => {
    if (err) {
      console.log(err);
    }
  })
    .then(files => {
      for (let file of files) {
        let srcPath = path.join(src, file.name);
        let outPath = path.join(out, file.name);
        if (file.isDirectory()) {
          copyDirectory(srcPath, outPath);
        } else {
          fs.promises.copyFile(srcPath, outPath);
        }
      }
    })
}

// Создаем папку на выход
fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    console.log(err);
  }
})
  .then 
clearDirectory(path.join(__dirname, 'project-dist'));

// создаем index.html из template и компонентов
fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, template) => {
  if (err) {
  console.log(err);
  };
  fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  }
  for (let file of files) {
    let componentName = file.name.split('.')[0];
    fs.readFile(path.join(__dirname, 'components', file.name), 'utf-8', (err, component) => {
    if (err) {
    console.log(err);
      }
      template = template.replace(`{{${componentName}}}`, component);
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, err => {
      if (err) {
    console.log(err);
      }
      })
    })
  }
  })
  
})
//Собираем стили


fs.promises.readdir(stylePath)
  .then(files => {
    for (let file of files) {
      let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8', err => {
        if (err) {
        console.log(err)
        }
      })
      readableStream.on('data', (chunk) => outputStyle.write(chunk));
    }
  })


fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, err => {
  if (err) {
  console.log(err)
  }
})
  .then
copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
