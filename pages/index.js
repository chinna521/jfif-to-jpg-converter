import { useState } from "react";

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

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>JFIF转JPG在线工具</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".jfif,image/jpeg"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit" style={{ marginTop: 20 }}>
          转换为JPG
        </button>
      </form>
      {downloadUrl && (
        <div style={{ marginTop: 30 }}>
          <a href={downloadUrl} download="converted.jpg">
            点击下载JPG图片
          </a>
        </div>
      )}
    </div>
  );
} 