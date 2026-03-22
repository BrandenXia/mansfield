import sharp from "sharp";

import { promises as fs } from "fs";
import { join, extname } from "path";
import { optimize } from "svgo";

const svgoConfig = {
  multipass: true,
  plugins: ["preset-default"],
};

const processFile = async (filePath) => {
  try {
    const originalSize = (await fs.stat(filePath)).size;
    let svgString = await fs.readFile(filePath, "utf8");

    const regex = /href=["']data:image\/(png|jpeg|jpg);base64,([^"']+)["']/gi;
    let match;
    const replacements = [];

    while ((match = regex.exec(svgString)) !== null) {
      const base64Data = match[2];
      const imageBuffer = Buffer.from(base64Data, "base64");

      const optimizedBuffer = await sharp(imageBuffer)
        .webp({ quality: 50, effort: 6 })
        .toBuffer();

      const newBase64 = optimizedBuffer.toString("base64");
      replacements.push({
        old: match[0],
        new: `href="data:image/webp;base64,${newBase64}"`,
      });
    }

    for (const rep of replacements)
      svgString = svgString.replace(rep.old, rep.new);

    const svgoResult = optimize(svgString, { path: filePath, ...svgoConfig });
    if (svgoResult.error) throw new Error(svgoResult.error);

    await fs.writeFile(filePath, svgoResult.data);
    const newSize = Buffer.byteLength(svgoResult.data, "utf8");

    const saved = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    console.log(`✅ ${filePath} | Saved: ${saved}%`);
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
};

async function walkDir(dir) {
  let files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);

    if (file.isDirectory())
      await walkDir(fullPath); // Go deeper (recursive)
    else if (file.isFile() && extname(fullPath).toLowerCase() === ".svg")
      await processFile(fullPath); // Process SVG
  }
}

const targetFolder = process.argv[2];

if (!targetFolder) {
  console.log("Usage: node batch-optimize.js <path-to-folder>");
  process.exit(1);
}

console.log(`Starting batch optimization on: ${targetFolder}...\n`);

walkDir(targetFolder)
  .then(() => console.log("\n🎉 Batch processing complete!"))
  .catch(console.error);
