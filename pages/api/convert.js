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
    return res.status(405).json({ error: "只支持POST请求" });
  }

  let file = null; // 声明file变量

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      allowEmptyFiles: false
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.file) {
      return res.status(400).json({ error: "请选择要转换的文件" });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    
    if (fileArray.length === 0) {
      return res.status(400).json({ error: "请选择要转换的文件" });
    }

    file = fileArray[0]; // 赋值给file变量
    const targetFormat = fields.targetFormat ? fields.targetFormat[0] : 'jpg'; // 获取目标格式
    
    // 获取高级设置
    const quality = fields.quality ? parseInt(fields.quality[0]) : 90;
    const maintainSize = fields.maintainSize ? fields.maintainSize[0] === 'true' : true;
    const autoOrient = fields.autoOrient ? fields.autoOrient[0] === 'true' : true;
    const removeMetadata = fields.removeMetadata ? fields.removeMetadata[0] === 'true' : false;
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/jfif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "不支持的文件格式，请上传JFIF或JPEG格式的图片" });
    }

    // 验证文件大小
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: "文件大小不能超过10MB" });
    }

    // 检查文件是否存在
    if (!fs.existsSync(file.filepath)) {
      return res.status(400).json({ error: "上传的文件不存在" });
    }

    // 读取文件
    const data = fs.readFileSync(file.filepath);
    
    if (data.length === 0) {
      return res.status(400).json({ error: "上传的文件为空" });
    }

    let convertedBuffer;
    let contentType;
    let fileName;
    let downloadFileName;

    // 开始构建sharp处理管道
    let sharpInstance = sharp(data);

    // 应用高级设置
    if (autoOrient) {
      sharpInstance = sharpInstance.rotate(); // 自动根据EXIF数据旋转
    }

    if (removeMetadata) {
      sharpInstance = sharpInstance.withMetadata(false); // 删除元数据
    } else {
      sharpInstance = sharpInstance.withMetadata(); // 保留元数据
    }

    // 根据目标格式进行转换
    if (targetFormat === 'jfif') {
      // 转换为JFIF格式
      convertedBuffer = await sharpInstance
        .jpeg({ 
          quality: quality,
          progressive: true,
          force: true
        })
        .toBuffer();
      contentType = "image/jpeg";
      fileName = "converted.jfif";
      downloadFileName = "converted.jfif";
    } else {
      // 转换为JPG格式
      convertedBuffer = await sharpInstance
        .jpeg({ 
          quality: quality,
          progressive: true,
          force: true
        })
        .toBuffer();
      contentType = "image/jpeg";
      fileName = "converted.jpg";
      downloadFileName = "converted.jpg";
    }

    // 将buffer转换为base64用于预览
    const base64Data = convertedBuffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Data}`;

    // 发送JSON响应，包含预览数据和下载信息
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      success: true,
      previewUrl: dataUrl,
      downloadUrl: dataUrl,
      fileName: downloadFileName,
      fileSize: convertedBuffer.length,
      originalFormat: file.mimetype,
      targetFormat: targetFormat,
      quality: quality,
      settings: {
        maintainSize,
        autoOrient,
        removeMetadata
      }
    });

  } catch (error) {
    console.error("图片转换错误:", error);
    
    if (error.message.includes("Input buffer contains unsupported image format")) {
      return res.status(400).json({ error: "不支持的图片格式，请确保上传的是有效的JFIF或JPEG图片" });
    } else if (error.message.includes("Invalid input")) {
      return res.status(400).json({ error: "无效的图片文件，请检查文件是否损坏" });
    } else {
      return res.status(500).json({ error: "图片转换失败: " + error.message });
    }
  } finally {
    // 清理临时文件
    try {
      if (file && file.filepath && fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
    } catch (cleanupError) {
      console.error("清理临时文件失败:", cleanupError);
    }
  }
} 