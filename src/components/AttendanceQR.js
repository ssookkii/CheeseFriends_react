import React from 'react';
import QRCode from 'qrcode.react';
import { useLocation } from "react-router-dom";

function AttendanceQR(props) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const eduCode = params.get("eduCode");
    const subCode = params.get("subCode");

  const qrValue = `eduCode:${eduCode},subCode:${subCode}`;
  return (
    <div>
      <h1>QR Code Example</h1>
      <QRCode value={qrValue} />
    </div>
  );
}

export default AttendanceQR;
