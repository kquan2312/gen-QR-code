import React, { useState, useEffect } from "react";
import { QRCode } from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";
import Footer from "./components/Footer";


export default function QRGenerator() {
  const [tab, setTab] = useState("text");

  const qrRef = useRef(null);
  const [fileName, setFileName] = useState("qr-code");

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current);
      const link = document.createElement("a");
      link.download = `${fileName || "qr-code"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // TEXT
  const [text, setText] = useState("");

  // WIFI
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  // BANKING (VietQR)
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // load bank list
  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((res) => res.json())
      .then((data) => setBanks(data.data))
      .catch((err) => console.error(err));
  }, []);

  // QR TEXT + WIFI
const generateQRValue = () => {
  if (tab === "text") {
    if (!text) return null; // nếu chưa nhập, không hiển thị QR
    return text;
  }

  if (tab === "wifi") {
    if (!ssid) return null; // chưa nhập tên WiFi, không hiển thị
    return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
  }

  return null;
};

  // QR BANKING (VietQR)
  const qrBankUrl =
    selectedBank && accountNumber
      ? `https://img.vietqr.io/image/${selectedBank}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          note
        )}&accountName=${encodeURIComponent(accountName)}`
      : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 p-6 gap-6">
      <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        QR Code Generator ✨
      </h1>
      <p className="text-teal-700 mb-8 text-sm font-semibold">Tạo mã QR nhanh chóng và dễ dàng</p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          onClick={() => setTab("text")}
          className={`px-6 py-2.5 rounded-full font-semibold transition ${
            tab === "text"
              ? "bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
              : "bg-white/90 text-teal-700 hover:shadow-md"
          }`}
        >
          Text
        </button>

        <button
          type="button"
          onClick={() => setTab("wifi")}
          className={`px-6 py-2.5 rounded-full font-semibold transition ${
            tab === "wifi"
              ? "bg-teal-500 text-white shadow-lg hover:bg-teal-600"
              : "bg-white/90 text-teal-700 hover:shadow-md"
          }`}
        >
          WiFi
        </button>

        <button
          type="button"
          onClick={() => setTab("bank")}
          className={`px-6 py-2.5 rounded-full font-semibold transition ${
            tab === "bank"
              ? "bg-cyan-500 text-white shadow-lg hover:bg-cyan-600"
              : "bg-white/90 text-teal-700 hover:shadow-md"
          }`}
        >
          Banking
        </button>
      </div>

      {/* Form */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5 border border-white/50">
        {tab === "text" && (
          <div>
            <label className="block text-sm font-semibold mb-2 text-teal-700">
              Nội dung QR
            </label>
            <input
              type="text"
              placeholder="Nhập nội dung..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
            />
          </div>
        )}

        {tab === "wifi" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Tên WiFi
              </label>
              <input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Mật khẩu
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Bảo mật
              </label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Không mật khẩu</option>
              </select>
            </div>
          </div>
        )}

        {tab === "bank" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Ngân hàng
              </label>
              <select
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="">Chọn ngân hàng</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.bin}>
                    {bank.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Số tài khoản
              </label>
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Tên tài khoản
              </label>
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Số tiền
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-teal-700 mb-2 block">
                Nội dung
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border border-teal-200 rounded-lg bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* QR */}
      <div
  className="mt-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col items-center border border-white/50"
  ref={qrRef}
>
  {tab === "bank" ? (
    qrBankUrl ? (
      <img src={qrBankUrl} alt="VietQR" className="w-56 h-56" />
    ) : (
      <p className="text-teal-400 text-sm">Nhập thông tin để tạo QR</p>
    )
  ) : generateQRValue() ? (
    <QRCode value={generateQRValue()} size={200} />
  ) : (
    <p className="text-teal-400 text-sm">Nhập đầy đủ thông tin để tạo QR</p>
  )}
</div>

      {/* Download */}
      <div className="mt-8 w-full max-w-md flex flex-col gap-3 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
        <label className="text-sm font-semibold text-teal-700">
          Tên file QR
        </label>
        <input
          type="text"
          placeholder="Nhập tên file..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full p-3 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50"
        />
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition hover:from-emerald-600 hover:to-teal-600"
        >
           Download QR
        </button>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}