import { useState, useEffect } from "react";
import { Search, Mail, MailOpen, Reply, Trash2, CheckCircle, MessageSquare } from "lucide-react";
import { getMessages, saveMessages, Message } from "../../utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    getMessages().then(setMessages);
  }, []);

  const filtered = messages.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    if (filter === "unread") return matchSearch && !m.read;
    if (filter === "read") return matchSearch && m.read;
    if (filter === "replied") return matchSearch && m.replied;
    return matchSearch;
  });

  const markRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setMessages(updated);
    saveMessages(updated);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    setReplyText("");
    if (!msg.read) markRead(msg.id);
  };

  const handleDelete = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveMessages(updated);
    if (selected?.id === id) setSelected(null);
    toast.success("Message deleted");
  };

  const handleReply = () => {
    if (!replyText.trim() || !selected) return;
    const updated = messages.map(m => m.id === selected.id ? { ...m, replied: true } : m);
    setMessages(updated);
    saveMessages(updated);
    setSelected({ ...selected, replied: true });
    setReplyText("");
    toast.success(`Reply sent to ${selected.email}`);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>Messages</h2>
          <p className="text-slate-500 mt-1">{messages.length} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
            {unreadCount} new messages
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-240px)]">
        {/* Messages List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-slate-50"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "unread", "read", "replied"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${filter === f ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  style={{ fontWeight: 500 }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-y-auto flex-1 divide-y divide-slate-50">
            {filtered.map(msg => (
              <motion.button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors ${selected?.id === msg.id ? "bg-orange-50 border-l-2 border-orange-500" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${msg.read ? "bg-slate-400" : "bg-orange-500"}`} style={{ fontWeight: 700 }}>
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between mb-0.5">
                      <p className={`text-sm truncate ${msg.read ? "text-slate-700" : "text-slate-900"}`} style={{ fontWeight: msg.read ? 400 : 600 }}>{msg.name}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                        {msg.replied && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 truncate mb-1" style={{ fontWeight: msg.read ? 400 : 500 }}>{msg.subject}</p>
                    <p className="text-xs text-slate-400 truncate">{msg.content}</p>
                    <p className="text-xs text-slate-300 mt-1">{msg.createdAt}</p>
                  </div>
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden"
              >
                {/* Message Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white" style={{ fontWeight: 700 }}>
                        {selected.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900" style={{ fontWeight: 600 }}>{selected.name}</p>
                        <p className="text-slate-500 text-sm">{selected.email}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{selected.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.replied && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full" style={{ fontWeight: 500 }}>Replied</span>
                      )}
                      <button onClick={() => handleDelete(selected.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-slate-900" style={{ fontWeight: 600 }}>{selected.subject}</h4>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-700 leading-relaxed">{selected.content}</p>
                  </div>
                </div>

                {/* Reply */}
                <div className="p-6 border-t border-slate-100">
                  <p className="text-sm text-slate-700 mb-2" style={{ fontWeight: 500 }}>Reply to {selected.name}</p>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <Reply className="w-4 h-4" />
                      Send Reply
                    </button>
                    <button
                      onClick={() => markRead(selected.id)}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <MailOpen className="w-4 h-4" />
                      Mark Read
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-slate-400"
              >
                <Mail className="w-16 h-16 mb-4 opacity-20" />
                <p style={{ fontWeight: 500 }}>Select a message to view</p>
                <p className="text-sm mt-1">Choose from the list on the left</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
