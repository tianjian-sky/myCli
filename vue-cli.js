#!/usr/bin/env node
// 上面那行一定要加，告诉shell用node来运行

const program = require('commander');
const chalk =require('chalk')

console.log(`
${chalk.yellowBright.bold.bgBlue('                                                            ')}
${chalk.greenBright.bold.bgBlue('                Hello, welcom to use myCli !                ')}
${chalk.yellowBright.bold.bgBlue('                                                            ')}
`);

 
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');
 
program.parse(process.argv);
 
if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);