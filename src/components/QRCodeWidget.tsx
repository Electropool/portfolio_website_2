import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function QRCodeWidget() {
  const url = 'https://www.electropool.online';

  const downloadQR = () => {
    const canvas = document.getElementById("portfolio-qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "ArpanKar_Portfolio_QR.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '12px', 
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ background: '#fff', padding: '8px', borderRadius: '8px' }}>
          <QRCodeCanvas 
            id="portfolio-qr-code" 
            value={url}
            size={110} 
            bgColor={"#ffffff"}
            fgColor={"#080808"}
            level={"Q"}
            includeMargin={false}
          />
        </div>
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadQR}
        className="glass-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Download size={14} />
        DOWNLOAD QR
      </motion.button>
    </div>
  );
}
