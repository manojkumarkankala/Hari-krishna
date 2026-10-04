import { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKET } from '@/lib/supabase';
import { AdminPageHeader, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { MediaItem } from '@/lib/types';

export function ImagesManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (error) {
      alert(`Failed to load: ${error.message}`);
    } else {
      setMedia((data as MediaItem[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

        const { error: dbError } = await supabase.from('media').insert({
          title: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'file',
          file_size: file.size,
          category: 'gallery',
        });
        if (dbError) throw dbError;
      }
      await loadMedia();
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const item = media.find((m) => m.id === deleteId);
    try {
      if (item) {
        const path = item.file_url.split('/portfolio/')[1];
        if (path) {
          await supabase.storage.from(STORAGE_BUCKET).remove([`gallery/${path}`]);
        }
      }
      const { error } = await supabase.from('media').delete().eq('id', deleteId);
      if (error) throw error;
      setDeleteId(null);
      await loadMedia();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <AdminPageHeader
        title="Image Manager"
        description="Upload and manage images for your portfolio"
        action={
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer">
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No images uploaded yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="p-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-3 group relative">
                <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => copyUrl(item.file_url)} className="p-2 rounded-lg bg-white/90 text-gray-900 hover:bg-white transition-all" title="Copy URL">
                    {copied === item.file_url ? <Copy size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg bg-white/90 text-red-500 hover:bg-white transition-all" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{(item.file_size / 1024).toFixed(1)} KB</p>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this image?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
