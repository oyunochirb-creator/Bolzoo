import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { DateInvitation } from '../types';
import { X, Download, Mail, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  invitation: DateInvitation;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  invitation,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#db2777', // Rose-600
          light: '#ffffff',
        },
      })
        .then((dataUrl) => setQrDataUrl(dataUrl))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `bolzoo-qr-${invitation.receiverName || 'date'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleSendEmail = () => {
    const emailTo = invitation.senderEmail?.trim() || '';
    const subject = encodeURIComponent(
      `💌 Таны ${invitation.receiverName}-д зориулсан болзооны урилгын линк ба QR код`
    );
    const body = encodeURIComponent(
      `Сайн байна уу, ${invitation.senderName || 'Эрхэм хэрэглэгч'}!\n\n` +
      `Таны ${invitation.receiverName || 'болзоот хүн'}-дээ зориулсан болзооны урилга амжилттай бэлэн боллоо. 🎉\n\n` +
      `🔗 Болзооны урилгын линк:\n${url}\n\n` +
      `💌 Мессеж: "${invitation.message || 'Надтай болзоонд явах уу?'}"\n\n` +
      `Хүлээн авагч энэ линкээр орж уулзах тов болон хамт хийх зүйлсээ сонгох болно!\n\n` +
      `Болзоо.mn - 100% Үнэгүй болзооны урилга бүтээгч 💕`
    );

    // Open mail client
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-pink-200 relative space-y-5 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Урилгын QR Код & Линк</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {invitation.receiverName || 'Болзоот хүн'}-д зориулсан урилга
          </h3>
          <p className="text-xs text-slate-500">
            Камераар уншуулах эсвэл линкийг хуулж илгээгээрэй
          </p>
        </div>

        {/* QR Code Container */}
        <div className="mx-auto w-56 h-56 p-3 bg-gradient-to-tr from-pink-50 to-sky-50 rounded-2xl border-2 border-pink-200 shadow-inner flex items-center justify-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Date Invitation QR Code"
              className="w-full h-full object-contain rounded-xl shadow-xs"
            />
          ) : (
            <div className="animate-pulse text-xs text-slate-400">QR код үүсгэж байна...</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>QR зураг татах</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Хуулагдлаа!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Линк хуулах</span>
              </>
            )}
          </button>
        </div>

        {/* Email Send Section */}
        <div className="pt-3 border-t border-slate-100 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-pink-500" />
              <span>И-мэйлээр өөртөө хадгалж авах:</span>
            </span>
            {invitation.senderEmail ? (
              <span className="text-[11px] text-pink-600 font-normal truncate max-w-[150px]">
                {invitation.senderEmail}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">(И-мэйл бичээгүй)</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSendEmail}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>
              {emailSent
                ? 'И-мэйл програм руу шилжүүлж байна...'
                : invitation.senderEmail
                ? `${invitation.senderEmail} рүү илгээх`
                : 'Миний и-мэйл рүү линк & QR-г илгээх'}
            </span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            Заавал бүртгүүлэх шаардлагагүй · 100% үнэгүй
          </p>
        </div>
      </div>
    </div>
  );
};
