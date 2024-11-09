import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/passwordInput";
import { Button } from "@/components/ui/button";

const WifiQRCodeGenerator = () => {
  const [ssid, setSsid] = useState("");
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    setShowQR(true);
  };
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState("WPA");

  const wifiString = `WIFI:T:${authType};S:${ssid};P:${password};;`;

  const qrRef = useRef(null);
  const [setSvgXml] = useState("");

  useEffect(() => {
    if (qrRef.current) {
      const serializer = new XMLSerializer();
      const svgElement = qrRef.current.querySelector("svg");
      if (svgElement) {
        const xmlString = serializer.serializeToString(svgElement);
        setSvgXml(xmlString);
      }
    }
  }, []);

  const downloadAsPNG = () => {
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const resizeSVG = svg.cloneNode(true);
    resizeSVG.setAttribute("width", "1000");
    resizeSVG.setAttribute("height", "1000");

    const svgData = new XMLSerializer().serializeToString(resizeSVG);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");

      downloadLink.download = `${ssid}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <img 
        src="/logo-aloha.png"
        alt="Logo ALOHA" 
        className="h-24 mb-6"
      />
      
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>🛜 Cual es el Wi-Fi de ALOHA?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2" onChange={generateQRCode}>
            <Label htmlFor="ssid">Nombre del Wifi (SSID)</Label>
            <Input
              id="ssid"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="Escriba el nombre del Wifi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <PasswordInput
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Escriba la contraseña"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authType">Tipo de Seguridad</Label>
            <Select value={authType} onValueChange={setAuthType}>
              <SelectTrigger id="authType">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="WPA2-EAP">WPA2-EAP</SelectItem>
                <SelectItem value="nopass">Sin Contraseña</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showQR && (
            <div ref={qrRef} className="flex justify-center mt-4">
              <QRCodeSVG value={wifiString} size={200} />
            </div>
          )}
          {showQR && (
            <div className="flex justify-center mt-4 space-x-4">
              <Button onClick={downloadAsPNG} className="w-full">
                Descargar Código QR
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WifiQRCodeGenerator;
