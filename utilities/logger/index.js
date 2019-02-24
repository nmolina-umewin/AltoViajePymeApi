"use strict";

// External Modules
const colors = require('colors');

function logError(msg)
{
    console.log('\t✘ Ooops...'.red, msg);
}

function Success(msg)
{
    console.log('\t✔'.green, msg);
}

function Warning(msg)
{
    console.log('\t⚠'.yellow, msg);
}

function Debug(msg)
{
    console.log(msg);
}

function Title(msg)
{
    console.log('\n', msg.yellow);
}

function Step(msg)
{
    console.log('\t•'.green, msg);
}

function Lap(msg)
{
    console.log('\t✦', msg);
}

function Arrow(msg)
{
    console.log('\t➜', msg);
}

module.exports = {
    Error  : logError,
    Success,
    Warning,
    Debug,
    Title,
    Step,
    Lap,
    Arrow
};
