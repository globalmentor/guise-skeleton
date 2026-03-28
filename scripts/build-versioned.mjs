import { readFileSync } from "fs";
import { createRequire } from "module";
import { replaceInFileSync } from "replace-in-file";

const require = createRequire(import.meta.url);
const zip = require("cross-zip");

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

switch (process.argv[2]) {
	case "insert-version":
		replaceInFileSync({
			files: "dist/css/guise-skeleton*.css",
			from: "x.x.x-SNAPSHOT",
			to: version
		});
		break;
	case "package":
		zip.zipSync("dist", `target/guise-skeleton-${version}.zip`);
		break;
}
