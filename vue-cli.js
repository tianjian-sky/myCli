#!/usr/bin/env node
// 上面那行一定要加，告诉shell用node来运行

const program = require('commander');
const chalk =require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const fs = require('fs')
const path =require('path')

// inquirer.registerPrompt('type', )


console.log(figlet.textSync('Tianjian SKY\'s CLI TOOL\'!', {
  font: 'Ghost',
  horizontalLayout: 'default',
  verticalLayout: 'default'
}));

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


main()

async function main() {
  let req = await  inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: 'Please choose which tool you want to use...',
    choices: [
      {
        name: 'vue-tool',
        value: 'vue',
        short: 'v'
      },
      {
        name: 'webpack-tool',
        value: 'webpack',
        short: 'wp'
      },
    ]
  }])
  if (req) {
    let baseType = req.type
    let subChoices = {
      vue: [{
        name: 'generate-component',
        value: 'gc',
        short: 'g',
      }],
      webpack: []
    }
    let req2 = await inquirer.prompt([{
      type: 'list',
      name: 'type',
      message: `Please choose which ${baseType} tool you want to use...`,
      choices: subChoices[baseType]
    }])
    console.log(req2)
    if (req2) {
      if (req2.type == 'gc') {
        let option = {}
        let req3 = await inquirer.prompt([{
          type: 'input',
          name: 'componentName',
          message: `Please input component name...`,
        }])
        console.log(req3)
        await generateComponent(req3)


      }
    }
  }
}

async function generateComponent (option) {
  let filePath = path.resolve(__dirname, './templates/vueComponent.txt')
  console.log(filePath)
  let templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  // templateFileStr.replace(/${option.name}/, option.)
  console.log(templateFile)
}