const sharp = require("sharp")
const glob = require("glob")
const path = require("path")
const fs = require("fs-extra")

module.exports = async function generate(p = 'images') {
    const chalk = await import('chalk')
    let html = fs.readFileSync('src/template.html').toString()
    let content = ''

    glob(p + '/*', (err, matches) => {
        console.log()
        matches.forEach(match => {
			let imgPath = match.split(path.sep)
			imgPath.splice(0, 1)
			imgPath = imgPath.join("/")

			let outputPath = imgPath.split(".")
			outputPath.splice(outputPath.length - 1, 1)
			outputPath.push("webp")
			outputPath = path.join("./dist", outputPath.join("."))

            if (/\.(\w*)$/i.test(match)) {
                content += `<a href="/${outputPath}">${
                    `<p>${imgPath}</p>`
                }<img src="/${outputPath}" width="100px"></a>\n`
            } else {
                generate(match)
            }
        })

        html = html.replace('{{}}', content)

        fs.writeFileSync(
            'dist/index.html',
            html,
            { flag: "w" },
            function (err) {
                if (err) throw err
            }
        )
    })
}