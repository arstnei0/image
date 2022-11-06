const sharp = require("sharp")
const glob = require("glob")
const path = require("path")
const fs = require("fs-extra")

module.exports = async function() {
    const chalk = await import('chalk')
    let html = fs.readFileSync('src/template.html').toString()
    let content = ''

    glob('images/**/*', (err, matches) => {
        matches.forEach(match => {
			let imgPath = match.split(path.sep)
			imgPath.splice(0, 1)
			imgPath = imgPath.join("/")

            if (/\.(\w*)$/i.test(match)) {
                content += `<a href="/${imgPath}"><img src="/${imgPath}" width="100px"></a>\n`
            } else {
                
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