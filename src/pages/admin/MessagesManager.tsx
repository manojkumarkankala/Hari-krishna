import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, Eye, MailOpen, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminPageHeader, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { ContactMessage } from '@/lib/types';

export function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      alert(`Failed to load messages: ${error.message}`);
    } else {
      setMessages((data as ContactMessage[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const { error } = await supabase.from('contact_messages').update({ is_read: !msg.is_read }).eq('id', msg.id);
    if (error) {
      alert(`Failed: ${error.message}`);
      return;
    }
    loadMessages();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId);
    if (error) {
      alert(`Failed: ${error.message}`);
      return;
    }
    setDeleteId(null);
    loadMessages();
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id);
      loadMessages();
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread' && m.is_read) return false;
    if (filter === 'read' && !m.is_read) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description={`${messages.length} total messages, ${unreadCount} unread`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No messages found.</p></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <Card key={msg.id}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 p-2.5 rounded-xl ${msg.is_read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-950/40'} text-${msg.is_read ? 'gray-400' : 'blue-500'}`}>
                  {msg.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openMessage(msg)}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{msg.name}</h3>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</p>
                  {msg.subject && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">{msg.subject}</p>}
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openMessage(msg)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => toggleRead(msg)} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">
                    {msg.is_read ? 'Unread' : 'Read'}
                  </button>
                  <button onClick={() => setDeleteId(msg.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Message Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div><span className="text-sm text-gray-500 dark:text-gray-400">From:</span> <span className="font-medium text-gray-900 dark:text-white">{selected.name}</span></div>
              <div><span className="text-sm text-gray-500 dark:text-gray-400">Email:</span> <a href={`mailto:${selected.email}`} className="font-medium text-blue-600 dark:text-blue-400">{selected.email}</a></div>
              {selected.phone && <div><span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span> <span className="font-medium text-gray-900 dark:text-white">{selected.phone}</span></div>}
              {selected.subject && <div><span className="text-sm text-gray-500 dark:text-gray-400">Subject:</span> <span className="font-medium text-gray-900 dark:text-white">{selected.subject}</span></div>}
              <div><span className="text-sm text-gray-500 dark:text-gray-400">Date:</span> <span className="text-gray-900 dark:text-white text-sm">{new Date(selected.created_at).toLocaleString()}</span></div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">Message:</span>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a href={`mailto:${selected.email}`} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-center transition-all">Reply</a>
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this message permanently?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
