#!/usr/bin/env node
// 上面那行一定要加，告诉shell用node来运行

const program = require('commander');
const chalk =require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const fs = require('fs')
const path =require('path')
const os = require('os');






let platform = os.platform();
console.log(platform)

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
        name: 'generate project skeleton',
        value: 'project',
        short: 'p'
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
      project: [{
        name: 'generate-project-skeleton',
        value: 'gp',
        short: 'gp',
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
      } else if (req2.type == 'gp') {
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
        await generateProject({
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

async function generateProject (option) {
  let vueDeps = ['vue', 'vue-loader', 'vue-router', 'vue-style-loader', 'vue-template-compiler', 'vuex']
  let devDepenencies = ['webpack-dev-server']
  let dependencies = ['@babel/core', '@babel/preset-env', 'core-js', 'autoprefixer' , 'axios' , '@babel/plugin-transform-async-to-generator', 'cross-env', 'css-loader', 'file-loader', 'html-webpack-plugin', 'postcss', 'postcss-loader', 'sass-loader', 'scss', 'scss-loader', 'style-loader', 'transfer-webpack-plugin', 'url-loader', 'webpack', 'webpack-cli']

  let cmdPkg = 'npm init'
  let cmdGit = 'git init'
  let cmdDevDeps = ''
  let cmdDeps = ''
  if(devDepenencies.length) {
    cmdDevDeps= `npm i --save-dev ${devDepenencies.join(' ')}`
  }
  if(dependencies.length) {
    if (option.type == 'vue') {
      dependencies = dependencies.concat(vueDeps)
    }
    cmdDeps= `npm i --save ${dependencies.join(' ')}`
  }
  const nrc = require('node-run-cmd');
  console.log('now initial package.json ......')
  let cmd1 = await nrc.run(cmdPkg, {
    onData (data) {
      console.log('command ondata', data)
    },
    onDone (data) {
      console.log('command done', data)
    },
    shell: true,
    detached: true
  })
  console.log('now initial git ......')
  let cmdg = await nrc.run(cmdGit, {
    onData (data) {
      console.log('command ondata', data)
    },
    onDone (data) {
      console.log('command done', data)
    },
    shell: true,
    detached: true
  })
  console.log(cmd1)
  if (cmdDevDeps) {
    console.log('now install dev dependencies......')
    let cmd2 = await nrc.run(cmdDevDeps, {
      onData (data) {
        console.log('command ondata', data)
      },
      onDone (data) {
        console.log('command done', data)
      },
      shell: true,
      detached: true
    })
  }
  if (cmdDeps) {
    console.log('now install dev dependencies......')
    let cmd2 = await nrc.run(cmdDeps, {
      onData (data) {
        console.log('command ondata', data)
      },
      onDone (data) {
        console.log('command done', data)
      },
      shell: true,
      detached: true
    })
  }
  console.log('now initial config file(webpack, postcss, babel, browerlist...) ......')
  let filePath = path.resolve(__dirname, './templates/webpack.config.template.js')
  let templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  let fileName= 'webpack.config.js'
  let req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })

  filePath = path.resolve(__dirname, './templates/webpack.config.template.js')
  templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  fileName= 'webpack.config.js'
  req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })

  filePath = path.resolve(__dirname, './templates/.browserlistrc')
  templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  fileName= '.browserlistrc'
  req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })

  filePath = path.resolve(__dirname, './templates/postcss.config.template.js')
  templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  fileName= 'pstcss.config.js'
  req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })

  filePath = path.resolve(__dirname, './templates/.babelrc')
  templateFileStr = fs.readFileSync(filePath, {
    encoding: 'utf-8'
  })
  fileName= '.babelrc'
  req = fs.writeFileSync(path.resolve(`./` + fileName), templateFileStr, function(error){
    console.log(error);
  })
 
  console.log('now initial project folders')
  await nrc.run(['mkdir dist', 'mkdir src', 'mkdir static'], {
    onData (data) {
      console.log('command ondata', data)
    },
    onDone (data) {
      console.log('command done', data)
    },
    shell: true,
    detached: true
  })
  let cdCmd = platform.indexOf('win') >= 0 ? 'cd ' : 'cd '
  let touchCmd = platform.indexOf('win') >= 0 ? 'cd .> ' : 'touch '
  await nrc.run(['mkdir components', 'mkdir assets', 'mkdir pages', 'mkdir styles', `${touchCmd}main.js`], {
    onData (data) {
      console.log('command ondata', data)
    },
    onDone (data) {
      console.log('command done', data)
    },
    shell: true,
    detached: true,
    cwd: path.resolve(process.cwd(), './src')
  })
  console.log(path.resolve(process.cwd(), './src'))
  console.log('project initial complete .....')
}