import React, { useState, useEffect } from 'react';
import { getEmailLogs, clearEmailLogs } from '../services/emailService';
import { 
  Mail, 
  X, 
  CheckCircle, 
  Trash2, 
  ExternalLink, 
  Send, 
  ShieldAlert, 
  Eye, 
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';

export const EmailNotificationDrawer = ({ isOpen, onClose }) => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL' | 'Customer' | 'ZapKart Ops / Admin'

  const refreshLogs = () => {
    const logs = getEmailLogs();
    setEmailLogs(logs);
    if (!selectedEmail && logs.length > 0) {
      setSelectedEmail(logs[0]);
    }
  };

  useEffect(() => {
    refreshLogs();
    const handleEmailSent = () => refreshLogs();
    window.addEventListener('zapkart_email_sent', handleEmailSent);
    return () => window.removeEventListener('zapkart_email_sent', handleEmailSent);
  }, []);

  if (!isOpen) return null;

  const filteredLogs = emailLogs.filter((log) => {
    if (filterRole === 'ALL') return true;
    return log.recipientRole === filterRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in no-print">
      <div 
        className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base">Automated Email Notification Hub</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  LIVE OUTBOX ({emailLogs.length})
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Inspect simulated automated emails dispatched to Customer & Company Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {emailLogs.length > 0 && (
              <button
                onClick={() => {
                  clearEmailLogs();
                  setSelectedEmail(null);
                }}
                className="text-xs text-gray-400 hover:text-rose-400 p-2 rounded-lg transition"
                title="Clear Email History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Role Bar */}
        <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Filter Mailbox:</span>
            <div className="flex bg-white rounded-lg p-0.5 border border-gray-200">
              <button
                onClick={() => setFilterRole('ALL')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  filterRole === 'ALL' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({emailLogs.length})
              </button>
              <button
                onClick={() => setFilterRole('Customer')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  filterRole === 'Customer' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer ({emailLogs.filter((e) => e.recipientRole === 'Customer').length})
              </button>
              <button
                onClick={() => setFilterRole('ZapKart Ops / Admin')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  filterRole === 'ZapKart Ops / Admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin (orders@zapkart.in)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 hidden sm:block">
            Status: <span className="text-emerald-700 font-bold">Active Webhook / SMTP Simulator</span>
          </div>
        </div>

        {/* 2-Pane Layout: Left List + Right Rendered HTML Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Email List */}
          <div className="w-full sm:w-80 border-r border-gray-200 overflow-y-auto bg-gray-50 divide-y divide-gray-100 shrink-0">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isCustomer = email.recipientRole === 'Customer';

                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3.5 cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-100/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        isCustomer ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {email.recipientRole}
                      </span>
                      <span className="text-gray-400 font-mono">
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 truncate mb-1">
                      {email.subject}
                    </h4>

                    <div className="text-[11px] text-gray-500 truncate">
                      To: <strong className="text-gray-700">{email.recipient}</strong>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                      <span>✓ {email.status}</span>
                      <span className="font-mono text-gray-400">#{email.orderId}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <span>No emails in this mailbox yet. Place or cancel an order to test live dispatch!</span>
              </div>
            )}
          </div>

          {/* Right: Rendered HTML Email Preview */}
          <div className="hidden sm:flex flex-1 flex-col overflow-hidden bg-gray-100">
            {selectedEmail ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Meta details bar */}
                <div className="p-3 bg-white border-b border-gray-200 text-xs flex items-center justify-between">
                  <div className="truncate max-w-md">
                    <span className="text-gray-500 font-medium">Recipient: </span>
                    <strong className="text-blue-700">{selectedEmail.recipient}</strong>
                    <span className="text-gray-400 mx-2">|</span>
                    <span className="text-gray-500">Subject: </span>
                    <strong className="text-gray-900">{selectedEmail.subject}</strong>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    200 OK • Dispatched
                  </span>
                </div>

                {/* Email HTML Iframe Container */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-xl mx-auto">
                    <iframe
                      title="Email Preview"
                      srcDoc={selectedEmail.htmlContent}
                      className="w-full h-[620px] border-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400 text-xs">
                Select an email from the left list to preview formatted HTML output.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
