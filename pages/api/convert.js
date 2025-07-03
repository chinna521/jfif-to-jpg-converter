import formidable from "formidable";
import fs from "fs";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      res.status(400).json({ error: "文件上传失败" });
      return;
    }
    const file = files.file;
    try {
      const data = fs.readFileSync(file.filepath);
      const jpgBuffer = await sharp(data).jpeg().toBuffer();
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", "attachment; filename=converted.jpg");
      res.status(200).send(jpgBuffer);
    } catch (e) {
      res.status(500).json({ error: "图片转换失败" });
    }
  });
} 