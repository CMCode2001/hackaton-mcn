import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  QrCode,
  CheckCircle,
  Link,
  Building,
  QrCodeIcon,
} from "lucide-react";

interface AdminQRCodeGeneratorProps {
  domain?: string;
}

const AdminQRCodeGenerator: React.FC<AdminQRCodeGeneratorProps> = ({
  domain = "hackaton-mcn-pi.vercel.app",
}) => {
  const [oeuvreId, setOeuvreId] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"svg" | "png" | "jpg">("svg");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOeuvreId(e.target.value);
    setCopied(false);
    setDownloaded(false);
  };

  const qrValue = oeuvreId
    ? `https://${domain}/oeuvres/${encodeURIComponent(oeuvreId)}`
    : "";

  const handleCopyLink = async () => {
    if (!qrValue) return;

    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur de copie:", err);
    }
  };

  const handleDownloadQR = async (format?: "svg" | "png" | "jpg") => {
    if (!qrValue) return;
    const fmt = format || downloadFormat || "svg";

    const svg = document.getElementById("qr-code") as SVGElement | null;
    if (!svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);

      if (fmt === "svg") {
        const blob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `qr-code-${oeuvreId || "untitled"}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      } else {
        // Convert SVG to PNG or JPG using canvas
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(new Error("Impossible de charger le SVG en image"));
          };
          img.onload = () => {
            try {
              // Use displayed size for better fidelity
              const rect = svg.getBoundingClientRect();
              const scale = 2; // export at 2x for better quality
              const width = Math.max(1, Math.round(rect.width * scale));
              const height = Math.max(1, Math.round(rect.height * scale));

              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (!ctx)
                throw new Error("Impossible d'obtenir le contexte canvas");

              // For JPG, draw a white background
              if (fmt === "jpg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, width, height);
              }

              // Draw the SVG image onto the canvas
              ctx.drawImage(img, 0, 0, width, height);

              // Convert to blob
              const mime = fmt === "png" ? "image/png" : "image/jpeg";
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error("Conversion en blob a échoué"));
                    return;
                  }
                  const downloadUrl = URL.createObjectURL(blob);
                  const downloadLink = document.createElement("a");
                  downloadLink.href = downloadUrl;
                  downloadLink.download = `qr-code-${oeuvreId || "untitled"}.${
                    fmt === "jpg" ? "jpg" : "png"
                  }`;
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  document.body.removeChild(downloadLink);
                  URL.revokeObjectURL(downloadUrl);
                  URL.revokeObjectURL(url);
                  resolve();
                },
                mime,
                0.95
              );
            } catch (err) {
              URL.revokeObjectURL(url);
              reject(err);
            }
          };
          // Important for some browsers to avoid tainted canvas
          img.crossOrigin = "anonymous";
          img.src = url;
        });
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error("Erreur lors du téléchargement du QR :", err);
    }
  };

  // IDs d'œuvres suggérées
  const suggestedOeuvres = [
    "origines-africaines",
    "mali-empire",
    "art-rupestre",
    "pharaons-noirs",
    "bronze-ife",
    "memoire-traite",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0603] to-[#1a120b] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#E6C158] rounded-2xl shadow-lg">
              <QrCode className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">
                Générateur de QR Codes
              </h1>
              <p className="text-[#C6B897] text-lg">
                Créez des QR codes pour vos œuvres du musée
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne de gauche - Formulaire */}
          <motion.div
            className="bg-gradient-to-br from-black/40 to-[#1a120b]/60 backdrop-blur-lg rounded-3xl p-8 border-2 border-[#D4AF37]/30 shadow-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <Building className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-[#D4AF37]">
                Configuration
              </h2>
            </div>

            {/* Champ de saisie */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="oeuvre-id"
                  className="block text-[#C6B897] font-medium mb-3"
                >
                  ID de l'œuvre
                </label>
                <input
                  id="oeuvre-id"
                  type="text"
                  value={oeuvreId}
                  onChange={handleChange}
                  placeholder="ex: origines-africaines"
                  className="w-full px-4 py-4 bg-[#1a120b] border-2 border-[#D4AF37]/30 rounded-2xl text-white placeholder-[#C6B897] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300"
                />
              </div>

              {/* Œuvres suggérées */}
              <div>
                <div className="block text-[#C6B897] font-medium mb-3">
                  Œuvres populaires
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedOeuvres.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setOeuvreId(suggestion)}
                      className="px-3 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl text-[#C6B897] hover:text-white transition-all duration-300 text-sm text-center truncate"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL générée */}
              {qrValue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4"
                >
                  <label
                    htmlFor="qr-url"
                    className="block text-[#C6B897] font-medium mb-3"
                  >
                    URL générée
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="qr-url"
                      type="text"
                      value={qrValue}
                      readOnly
                      className="flex-1 px-4 py-3 bg-[#1a120b] border border-[#D4AF37]/30 rounded-xl text-[#C6B897] text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-[#D4AF37] text-black hover:bg-[#E6C158]"
                      }`}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? "Copié !" : "Copier"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Colonne de droite - QR Code */}
          <motion.div
            className="bg-gradient-to-br from-black/40 to-[#1a120b]/60 backdrop-blur-lg rounded-3xl p-8 border-2 border-[#D4AF37]/30 shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <QrCodeIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-[#D4AF37]">QR Code</h2>
            </div>

            {qrValue ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#D4AF37]/20">
                    <QRCodeSVG
                      id="qr-code"
                      value={qrValue}
                      size={200}
                      level="H"
                      includeMargin
                      bgColor="#FFFFFF"
                      fgColor="#0A0603"
                    />
                  </div>
                </div>

                {/* Contrôles de téléchargement - CORRIGÉ */}
                <div className="space-y-4">
                  {/* Sélection du format */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-3 bg-[#1a120b] border border-[#D4AF37]/30 rounded-xl px-2 py-3">
                      <label htmlFor="format-select" className="text-[#C6B897] text-sm font-medium whitespace-nowrap">
                        Format :
                      </label>
                      <select
                        id="format-select"
                        value={downloadFormat}
                        onChange={(e) =>
                          setDownloadFormat(
                            e.target.value as "svg" | "png" | "jpg"
                          )
                        }
                        className="bg-transparent text-[#C6B897] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded px-2 py-1"
                      >
                        <option value="svg">SVG</option>
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                      </select>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadQR()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          downloaded
                            ? "bg-green-500 text-white"
                            : "bg-[#D4AF37] text-black hover:bg-[#E6C158]"
                        }`}
                      >
                        {downloaded ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {downloaded}
                      </button>

                      <button
                        onClick={() => window.open(qrValue, "_blank")}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-semibold hover:bg-[#D4AF37]/10 transition-all duration-300"
                      >
                        <Link className="w-4 h-4" />
                        Tester
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="bg-[#D4AF37]/10 rounded-2xl p-4 border border-[#D4AF37]/20">
                  <h4 className="text-[#D4AF37] font-semibold mb-2">
                    Instructions
                  </h4>
                  <ul className="text-[#C6B897] text-sm space-y-1">
                    <li>• Téléchargez le QR code</li>
                    <li>• Imprimez-le et placez-le près de l'œuvre</li>
                    <li>• Les visiteurs pourront scanner avec leur téléphone</li>
                    <li>• Testez le lien pour vérifier qu'il fonctionne</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-12 h-12 text-[#D4AF37]/40" />
                </div>
                <p className="text-[#C6B897] text-lg">
                  Entrez un ID d'œuvre pour générer le QR code
                </p>
                <p className="text-[#C6B897]/60 text-sm mt-2">
                  Le QR code s'affichera ici automatiquement
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminQRCodeGenerator;