const sharp = require("sharp")
const glob = require("glob")
const path = require("path")
const fs = require("fs-extra")
const ui = require('./ui')

;(async () => {
	const chalk = await (await import("chalk")).default

	console.log(chalk.yellow("Clearing output directory..."))
	fs.emptyDirSync("dist")
	console.log(chalk.yellow("Output directory cleared."))

	glob("./images/**/*.*", async (err, matches) => {
		matches.forEach(async (match) => {
			let imgPath = match.split(path.sep)
			imgPath.splice(0, 2)
			imgPath = imgPath.join("/")
			let outputPath = imgPath.split(".")
			outputPath.splice(outputPath.length - 1, 1)

			let outputDir = outputPath[0].split(path.sep)
			outputDir.pop()
			outputDir = path.join("./dist", outputDir.join("/"))

			outputPath.push("webp")
			outputPath = path.join("./dist", outputPath.join("."))

			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true })
			}

			sharp(match)
				.webp({
                    quality: 80
                })
				.toBuffer((err, data, info) => {
					fs.writeFile(
						outputPath,
						data,
						{ flag: "w" },
						function (err) {
							if (err) throw err
							console.log(
								`${chalk.blue(
									imgPath
								)} coonverted to ${chalk.green(outputPath)}`
							)
						}
					)
				})
		})
	})
	
	await ui()
})()
