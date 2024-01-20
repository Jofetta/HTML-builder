const path = require('path');
const fs = require('fs');

const { stdin, stdout, exit } = process;
process.on('exit', () => console.log('Good Bye!'));
process.on('SIGINT', () => process.exit());

const outputPath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(outputPath);

stdout.write('Enter your text\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(chunk);
  }
});




