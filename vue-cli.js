const commander = require('commander');

commander.version('1.0.0')
    .option('-a, --aaa', 'aaaaa')
    .option('-b, --bbb', 'bbbbb')
    .option('-c, --ccc [name]', 'ccccc')
    .parse(process.argv);


if (commander.aaa) {
    console.log('aaa');
}

if (commander.bbb) {
    console.log('bbb');
}

if (commander.ccc) {
    console.log('ccc', commander.ccc);
}