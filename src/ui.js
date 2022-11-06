const sharp = require("sharp")
const glob = require("glob")
const path = require("path")
const fs = require("fs-extra")

module.exports = async function generate(p = 'images', last) {
    const chalk = await (await import('chalk')).default
    let html = fs.readFileSync('src/template.html').toString()

    let content = ''

    let outputPath = p.split(path.sep)
    outputPath.splice(0, 1)
    outputPath = outputPath.join('/')

    content += `<h1>/${outputPath}</h1>`
    content += `<a href="/">Root</a><br />\n`
    content += `<a target="_blank" href="${'https://github.com/zihan-ch/image/upload/main/' + p}">Upload images at this directory</a>\n`

    if (last !== undefined) {
        content += `<div class="dir"><a href="/${last}">../</a></div>\n`
    }

    const outputDir = path.join('dist', outputPath)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    glob(p + '/*', (err, matches) => {
        matches.forEach(match => {
			let imgPath = match.split(path.sep)
			imgPath.splice(0, 1)
			imgPath = imgPath.join("/")

			let short = match.split(path.sep)
			short.splice(0, short.length - 1)
			short = short.join("/")

			let o = imgPath.split(".")
			o.splice(o.length - 1, 1)
			o.push("webp")
			o = o.join(".")

            if (/\.(\w*)$/i.test(match)) {
                content += `<div class="image"><a href="/${o}">${
                    `<p>${short}</p>`
                }<img src="/${o}" width="200px"></a></div>\n`
            } else {
                content += `<div class="dir"><a href="/${imgPath}">${short}/</a></div>\n`
                generate(match, outputPath)
            }
        })

        content += `<p id="deploy-time">Latest deploy: ${new Date().toLocaleString()}</p>\n`

        html = html.replace('{{}}', content)

        fs.writeFileSync(
            path.join('dist', outputPath, 'index.html'),
            html,
            { flag: "w" },
            function (err) {
                if (err) throw err
            }
        )

        console.log(`${path.join('dist', outputPath, 'index.html')} ${chalk.green('generated.')}`)
    })
}
