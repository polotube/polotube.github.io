/*
======
dominant_color - komponent na yt2009 używający convert z imagemagicka

torl/nb, 2022-2024
======
*/

const child_process = require("child_process")

module.exports = function(file_path, callback, colors, cropSide) {
    let command = [
        `magick convert`,
        `"${file_path}${cropSide ? "[1]" : ""}"`,
        `+dither -colors ${colors || 32}`,
        `-define histogram:unique-colors=true`,
        `-format "%c" histogram:info:`,
        `| sort ${(
            process.platform == "linux"
            || process.platform == "darwin"
        ) ? "-n" : ""}`
    ]
    child_process.exec(command.join(" "), (error, stdout, stderr) => {
        let split_output = stdout.split("\n");
        let output = ""

        split_output.forEach(part => {
            if(part.length !== 0) {
                output = part;
            }
        })

        if(!output.split("(")[1]) {
            console.log(`
===========

WARN: failed to find the channel's dominant color!
this is most likely an issue with \`magick\` not
set up properly.

===========`)
            callback([180, 180, 180])
            return;
        }
        output = output.split("(")[1].split(")")[0].split(",")
        let finalOutput = []

        output.forEach((part) => {
            finalOutput.push(Math.floor(parseInt(part)))
        })

        callback(finalOutput)
    })
}