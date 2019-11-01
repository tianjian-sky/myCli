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

 
// 解析cli 参数
// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza');
 
// program.parse(process.argv);
 
// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);

main()

async function main() {
  let req = await inquirer.prompt([{
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
      }, {
        name: 'generate-mixin',
        value: 'gm',
        short: 'm',
      }],
      webpack: [{
        name: 'generate-webpack-config',
        value: 'gwp',
        short: 'gwp',
      }]
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
        option.componentName = req3.componentName
        let req4 = await  inquirer.prompt([{
          type: 'list',
          name: 'styleProcessor',
          message: 'Please choose which style processor you want to use...',
          choices: [
            {
              name: 'scss',
              value: 'scss',
              short: 'c'
            },
            {
              name: 'sass',
              value: 'sass',
              short: 'a'
            },
            {
              name: 'less',
              value: 'less',
              short: 'l'
            },
            {
              name: 'css',
              value: 'css',
              short: 'c'
            },
          ]
        }])
        option.styleProcessor = req4.styleProcessor
        await generateComponent(option)
      } else if (req2.type == 'gm') {
        let option = {}
        let req3 = await inquirer.prompt([{
          type: 'input',
          name: 'fileName',
          message: `Please input file name...`,
        }])
        console.log(req3)
        option.fileName = req3.fileName + '.js' || 'mixin.js'
        await generateMixin(option)
      } else if (req2.type == 'gwp') {
        let type
        let req3 = await  inquirer.prompt([{
          type: 'list',
          name: 'projectType',
          message: 'Please choose the project type...',
          choices: [
            {
              name: 'es6+vue',
              value: 'vue',
              short: 'v'
            },
            {
              name: 'es6',
              value: 'es6',
              short: 'e'
            },
          ]
        }])
        type = req3.projectType
        await generateWebpackConfig({
          type
        })
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
  templateFileStr = templateFileStr.replace(/\$\{option\.name\}/, option.componentName)
  templateFileStr = templateFileStr.replace(/\$\{option\.style\}/, option.styleProcessor)
  
  console.log(templateFileStr)
  const fileName= option.componentName + '.vue'
  let req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })
  console.log(1, req)
}

async function generateMixin (option) {
  let filePath = path.resolve(__dirname, './templates/vueMixin.txt')
  console.log(filePath)
  let templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  
  console.log(templateFileStr)
  const fileName= option.fileName
  let req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })
  console.log(1, req)
}

async function generateWebpackConfig (option) {
  let filePath = path.resolve(__dirname, './templates/webpack.config.template.js')
  console.log(filePath)
  let templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  // templateFileStr = templateFileStr.replace(/\$\{option\.name\}/, option.componentName)
  // templateFileStr = templateFileStr.replace(/\$\{option\.style\}/, option.styleProcessor)
  
  console.log(templateFileStr)
  const fileName= 'webpack.config.js'
  let req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })
}