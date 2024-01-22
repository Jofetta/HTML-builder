const path = require('path');
const fs = require('fs');


// Удаляем старые файлы, если в папке что-то есть
async function clearDirectory(directory) {
  const filenames = await fs.promises.readdir(directory, { withFileTypes: true })
    for (let filename of filenames) {
      let directoryPath = path.join(directory, filename.name);
      if (filename.isFile()) {
        await fs.promises.unlink(directoryPath)
      } else {
        await clearDirectory(directoryPath);
      }
    }
}

// Копируем ассеты

async function copyDirectory(src, out) {
  await fs.promises.mkdir(out, { recursive: true });
  const files = await fs.promises.readdir(src, { withFileTypes: true });
      for (let file of files) {
        let srcPath = path.join(src, file.name);
        let outPath = path.join(out, file.name);
        if (file.isDirectory()) {
          await copyDirectory(srcPath, outPath);
        } else {
          await fs.promises.copyFile(srcPath, outPath);
        }
      }
}

async function startBundler() {
  try {
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await clearDirectory(path.join(__dirname, 'project-dist'));
    
    let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    const files = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    await Promise.all(files.map(async (file) => {
      let componentName = file.name.split('.')[0];
      const component = await fs.promises.readFile(path.join(__dirname, 'components', file.name), 'utf-8');
      template = template.replace(`{{${componentName}}}`, component);
    }));

    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template);

    await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
    await copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
    const stylePath = path.join(__dirname, 'styles');
    fs.promises.readdir(stylePath)
      .then(styleFiles => {
        
      const outputStyle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
      for (let file of styleFiles) {
      let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
      readableStream.on('data', (chunk) => outputStyle.write(chunk));
    }
      })
      
  } catch (err) {
    console.log(err);
  }
}

startBundler();

