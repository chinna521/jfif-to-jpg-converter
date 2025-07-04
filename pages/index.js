import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } else {
      alert("转换失败，请上传有效的JFIF图片！");
    }
  };

  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

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
      </Head>
      
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center"
      }}>
        <h1 style={{
          color: "#333",
          marginBottom: "30px",
          fontSize: "2.5rem",
          fontWeight: "600",
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          JFIF转JPG在线工具
        </h1>
        
        <p style={{
          color: "#666",
          marginBottom: "30px",
          fontSize: "1.1rem",
          lineHeight: "1.6"
        }}>
          快速将JFIF格式图片转换为JPG格式，支持在线转换和下载
        </p>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
          <div style={{
            border: "3px dashed #ddd",
            borderRadius: "15px",
            padding: "40px 20px",
            marginBottom: "25px",
            transition: "all 0.3s ease",
            cursor: "pointer",
            backgroundColor: "#fafafa"
          }}>
            <input
              type="file"
              accept=".jfif,image/jpeg"
              onChange={handleFileChange}
              style={{
                width: "100%",
                height: "100%",
                opacity: "0",
                position: "absolute",
                cursor: "pointer"
              }}
            />
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px"
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
                {file ? `已选择: ${file.name}` : "点击选择JFIF文件"}
              </div>
              <div style={{
                fontSize: "0.9rem",
                color: "#666"
              }}>
                支持 .jfif 格式图片
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!file}
            style={{
              backgroundColor: file ? "#667eea" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "15px 40px",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: file ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              boxShadow: file ? "0 5px 15px rgba(102, 126, 234, 0.4)" : "none",
              minWidth: "200px"
            }}
            onMouseOver={(e) => {
              if (file) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseOut={(e) => {
              if (file) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {file ? "🚀 转换为JPG" : "请先选择文件"}
          </button>
        </form>
        
        {downloadUrl && (
          <div style={{
            background: "linear-gradient(45deg, #4CAF50, #45a049)",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 5px 15px rgba(76, 175, 80, 0.3)"
          }}>
            <a 
              href={downloadUrl} 
              download="converted.jpg"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              📥 点击下载JPG图片
            </a>
          </div>
        )}
        
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
    </div>
  );
} 