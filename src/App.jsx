import React, { useState, useEffect, useRef } from "react";
import { QRCode } from "react-qr-code";
import * as htmlToImage from "html-to-image";
import Footer from "./components/Footer";

// reusable field
const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 text-left">
    <label className="text-sm font-semibold text-teal-700">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full h-[42px] px-3 border border-teal-200 rounded-xl bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400";

export default function QRGenerator() {
  const [tab, setTab] = useState("text");

  const qrRef = useRef(null);
  const [fileName, setFileName] = useState("qr-code");

  const handleDownload = async () => {
    if (!qrRef.current) return;
    const dataUrl = await htmlToImage.toPng(qrRef.current);
    const link = document.createElement("a");
    link.download = `${fileName || "qr-code"}.png`;
    link.href = dataUrl;
    link.click();
  };

  // TEXT
  const [text, setText] = useState("");

  // WIFI
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  // BANK
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((res) => res.json())
      .then((data) => setBanks(data.data));
  }, []);

  const generateQRValue = () => {
    if (tab === "text") return text || null;
    if (tab === "wifi")
      return ssid
        ? `WIFI:T:${encryption};S:${ssid};P:${password};;`
        : null;
    return null;
  };

  const qrBankUrl =
    selectedBank && accountNumber
      ? `https://img.vietqr.io/image/${selectedBank}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          note
        )}&accountName=${encodeURIComponent(accountName)}`
      : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 p-6 gap-6">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        QR Code Generator ✨
      </h1>

      {/* Tabs */}
      <div className="flex gap-3">
        {["text", "wifi", "bank"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-full font-semibold transition ${
              tab === t
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-white/90 text-teal-700"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white/90 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-5">
        {tab === "text" && (
          <FormField label="Nội dung QR">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung..."
              className={inputClass}
            />
          </FormField>
        )}

        {tab === "wifi" && (
          <>
            <FormField label="Tên WiFi">
              <input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Mật khẩu">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Bảo mật">
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className={inputClass}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Không mật khẩu</option>
              </select>
            </FormField>
          </>
        )}

        {tab === "bank" && (
          <>
            <FormField label="Ngân hàng">
              <select
                onChange={(e) => setSelectedBank(e.target.value)}
                className={inputClass}
              >
                <option value="">Chọn ngân hàng</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.bin}>
                    {bank.shortName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Số tài khoản">
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Tên tài khoản">
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Số tiền">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Nội dung">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </>
        )}
      </div>

      {/* QR */}
      <div
        ref={qrRef}
        className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-center"
      >
        {tab === "bank" ? (
          qrBankUrl ? (
            <img src={qrBankUrl} className="w-52 h-52" />
          ) : (
            <p className="text-gray-400 text-sm">Nhập thông tin</p>
          )
        ) : generateQRValue() ? (
          <QRCode value={generateQRValue()} size={200} />
        ) : (
          <p className="text-gray-400 text-sm">Nhập dữ liệu</p>
        )}
      </div>

      {/* Download */}
      <div className="w-full max-w-md flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-lg">
        <FormField label="Tên file QR">
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className={inputClass}
          />
        </FormField>

        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl font-semibold hover:shadow-lg"
        >
          Download QR
        </button>
      </div>

      <Footer />
    </div>
  );
}