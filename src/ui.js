const sharp = require("sharp")
const glob = require("glob")
const path = require("path")
const fs = require("fs-extra")

module.exports = async function generate(p = 'images') {
    const chalk = await (await import('chalk')).default
    let html = fs.readFileSync('src/template.html').toString()
    let content = ''

    glob(p + '/*', (err, matches) => {
        matches.forEach(match => {
			let imgPath = match.split(path.sep)
			imgPath.splice(0, 1)
			imgPath = imgPath.join("/")

			let outputPath = imgPath.split(".")
			outputPath.splice(outputPath.length - 1, 1)
			outputPath.push("webp")
			outputPath = outputPath.join(".")

            if (/\.(\w*)$/i.test(match)) {
                content += `<a href="/${outputPath}">${
                    `<p>${imgPath}</p>`
                }<img src="/${outputPath}" width="100px"></a>\n`
            } else {
                content += `<a href="/${imgPath}">/${imgPath}</a>\n`
                generate(match)
            }
        })

        html = html.replace('{{}}', content)

        let outputPath = p.split(path.sep)
        outputPath.splice(0, 1)
        outputPath = outputPath.join('/')

        const outputDir = path.join('dist', outputPath)
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

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