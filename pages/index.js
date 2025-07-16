import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetFormat, setTargetFormat] = useState("jpg");
  const [convertedFileName, setConvertedFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [imageQuality, setImageQuality] = useState(90);
  const [maintainSize, setMaintainSize] = useState(true);
  const [autoOrient, setAutoOrient] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setConvertedUrl("");
    setError("");
    
    // 创建预览URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/jfif'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("请选择JFIF或JPEG格式的图片文件");
      setFile(null);
      setPreviewUrl("");
      return;
    }
    
    // 验证文件大小 (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过10MB");
      setFile(null);
      setPreviewUrl("");
      return;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setIsLoading(true);
    setError("");
    setConvertedUrl("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFormat", targetFormat);
      formData.append("quality", imageQuality);
      formData.append("maintainSize", maintainSize);
      formData.append("autoOrient", autoOrient);
      formData.append("removeMetadata", removeMetadata);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setConvertedUrl(data.previewUrl);
          setConvertedFileName(data.fileName);
        } else {
          setError(data.error || "转换失败");
        }
      } else {
        try {
          const errorData = await res.json();
          setError(errorData.error || "转换失败，请检查文件格式是否正确");
        } catch (parseError) {
          setError(`转换失败 (${res.status}): ${res.statusText}`);
        }
      }
    } catch (err) {
      setError(`网络错误: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 清理预览URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5479256761185412"
          crossOrigin="anonymous"
        ></script>
        {/* Google Analytics 代码已迁移到 _app.js */}
      </Head>
      
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        width: "100%",
        textAlign: "center"
      }}>
        <h1 style={{
          color: "#333",
          marginBottom: "10px",
          fontSize: "2.5rem",
          fontWeight: "600",
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          JFIF ↔ JPG 转换器
        </h1>
        
        <p style={{
          color: "#666",
          marginBottom: "30px",
          fontSize: "1.1rem",
          lineHeight: "1.6"
        }}>
          免费在线将 JFIF 转换为 JPG，或将 JPG 转换为 JFIF
        </p>

        {/* 转换格式选择 */}
        <div style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "10px 20px",
            borderRadius: "25px",
            backgroundColor: targetFormat === "jpg" ? "#667eea" : "#f0f0f0",
            color: targetFormat === "jpg" ? "white" : "#333",
            transition: "all 0.3s ease"
          }}>
            <input
              type="radio"
              name="targetFormat"
              value="jpg"
              checked={targetFormat === "jpg"}
              onChange={(e) => setTargetFormat(e.target.value)}
              style={{ display: "none" }}
            />
            🖼️ JFIF → JPG
          </label>
          
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "10px 20px",
            borderRadius: "25px",
            backgroundColor: targetFormat === "jfif" ? "#667eea" : "#f0f0f0",
            color: targetFormat === "jfif" ? "white" : "#333",
            transition: "all 0.3s ease"
          }}>
            <input
              type="radio"
              name="targetFormat"
              value="jfif"
              checked={targetFormat === "jfif"}
              onChange={(e) => setTargetFormat(e.target.value)}
              style={{ display: "none" }}
            />
            🖼️ JPG → JFIF
          </label>
        </div>

        {/* 文件上传区域 */}
        <div style={{
          marginBottom: "30px"
        }}>
          <div 
            style={{
              border: "3px dashed #ddd",
              borderRadius: "15px",
              padding: "60px 20px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              backgroundColor: isDragOver ? "#f0f8ff" : "#fafafa",
              borderColor: isDragOver ? "#667eea" : "#ddd",
              position: "relative",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".jfif,.jpg,.jpeg,image/jpeg"
              onChange={handleFileChange}
              style={{
                width: "100%",
                height: "100%",
                opacity: "0",
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0
              }}
            />
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "3rem",
                color: "#667eea"
              }}>📁</div>
              <div style={{
                fontSize: "1.2rem",
                color: "#333",
                fontWeight: "500"
              }}>
                {file ? `已选择: ${file.name}` : "选择文件"}
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: "#666"
              }}>
                拖拽文件到此处，或点击选择文件
              </div>
              <div style={{
                fontSize: "0.8rem",
                color: "#999"
              }}>
                支持 .jfif, .jpg, .jpeg 格式图片 (最大10MB)
              </div>
            </div>
          </div>
        </div>

        {/* 高级设置 */}
        <div style={{
          marginBottom: "30px",
          textAlign: "left"
        }}>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto 15px auto"
            }}
          >
            {showAdvancedSettings ? "▼" : "▶"} 高级设置（可选）
          </button>
          
          {showAdvancedSettings && (
            <div style={{
              background: "#f8f9fa",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e9ecef"
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>图像选项</h4>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}>
                  <input
                    type="checkbox"
                    checked={maintainSize}
                    onChange={(e) => setMaintainSize(e.target.checked)}
                  />
                  保持原始大小
                </label>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>
                  图像质量: {imageQuality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <input
                    type="checkbox"
                    checked={autoOrient}
                    onChange={(e) => setAutoOrient(e.target.checked)}
                  />
                  自动定向（使用EXIF数据调整图像方向）
                </label>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <input
                    type="checkbox"
                    checked={removeMetadata}
                    onChange={(e) => setRemoveMetadata(e.target.checked)}
                  />
                  删除元数据（减小文件大小）
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
            color: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
            fontSize: "0.9rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 转换按钮 */}
        <button 
          onClick={handleSubmit}
          disabled={!file || isLoading}
          style={{
            backgroundColor: file && !isLoading ? "#667eea" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "15px 40px",
            fontSize: "1.2rem",
            fontWeight: "600",
            cursor: file && !isLoading ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            boxShadow: file && !isLoading ? "0 5px 15px rgba(102, 126, 234, 0.4)" : "none",
            minWidth: "200px",
            position: "relative",
            marginBottom: "30px"
          }}
          onMouseOver={(e) => {
            if (file && !isLoading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseOut={(e) => {
            if (file && !isLoading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
            }
          }}
        >
          {isLoading ? (
            <span>
              <span style={{
                display: "inline-block",
                animation: "spin 1s linear infinite",
                marginRight: "8px"
              }}>🔄</span>
              转换中...
            </span>
          ) : file ? `转换为${targetFormat.toUpperCase()}` : "请先选择文件"}
        </button>

        {/* 预览区域 */}
        {(previewUrl || convertedUrl) && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px"
          }}>
            {/* 原图预览 */}
            {previewUrl && (
              <div style={{
                background: "#f8f9fa",
                borderRadius: "15px",
                padding: "20px",
                border: "2px solid #e9ecef"
              }}>
                <h3 style={{
                  margin: "0 0 15px 0",
                  color: "#333",
                  fontSize: "1.1rem"
                }}>
                  📸 原图预览
                </h3>
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "150px",
                  overflow: "hidden",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd"
                }}>
                  <img
                    src={previewUrl}
                    alt="原图预览"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
                {file && (
                  <div style={{
                    marginTop: "10px",
                    fontSize: "0.9rem",
                    color: "#666"
                  }}>
                    <div>文件名: {file.name}</div>
                    <div>大小: {formatFileSize(file.size)}</div>
                  </div>
                )}
              </div>
            )}

            {/* 转换结果预览 */}
            {convertedUrl && (
              <div style={{
                background: "linear-gradient(45deg, #4CAF50, #45a049)",
                borderRadius: "15px",
                padding: "20px",
                color: "white"
              }}>
                <h3 style={{
                  margin: "0 0 15px 0",
                  fontSize: "1.1rem"
                }}>
                  ✅ 转换结果
                </h3>
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "150px",
                  overflow: "hidden",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)"
                }}>
                  <img
                    src={convertedUrl}
                    alt="转换结果预览"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
                <div style={{
                  marginTop: "15px"
                }}>
                  <a 
                    href={convertedUrl} 
                    download={convertedFileName}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
                    }}
                  >
                    📥 下载转换后的图片
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 使用说明 */}
        <div style={{
          background: "#f8f9fa",
          borderRadius: "15px",
          padding: "20px",
          marginBottom: "30px",
          textAlign: "left"
        }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>如何将 JFIF 转换为 JPG？</h3>
          <ol style={{ margin: 0, paddingLeft: "20px", color: "#666", lineHeight: "1.6" }}>
            <li>点击<strong>"选择文件"</strong>按钮来选择您的源文件，或直接拖拽文件到上传区域。</li>
            <li>选择目标格式（JFIF → JPG 或 JPG → JFIF）。</li>
            <li>可选：调整高级设置以获得更好的转换效果。</li>
            <li>点击<strong>"转换"</strong>按钮开始转换。</li>
            <li>转换完成后，点击<strong>"下载"</strong>按钮保存转换后的图片。</li>
          </ol>
        </div>

        {/* 安全说明 */}
        <div style={{
          background: "linear-gradient(45deg, #28a745, #20c997)",
          borderRadius: "15px",
          padding: "20px",
          color: "white",
          marginBottom: "30px"
        }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem" }}>🔒 免费且安全</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
            我们的 JFIF 到 JPG 转换器是免费的，适用于任何网络浏览器。我们保证文件的安全性和隐私性。
            文件受 256 位 SSL 加密保护，并在几小时后自动删除。
          </p>
        </div>
        
        {/* Google AdSense 广告位 */}
        <div style={{ 
          margin: "30px 0",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          border: "1px solid #e9ecef"
        }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-5479256761185412"
            data-ad-slot="你的广告位ID"
            data-ad-format="auto"
          ></ins>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}