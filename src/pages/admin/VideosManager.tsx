import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Video as VideoIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { VideoItem } from '@/lib/types';

const emptyVideo = {
  id: '',
  title: '',
  description: '',
  video_url: '',
  youtube_url: '',
  thumbnail_url: '',
  is_enabled: true,
  display_order: 0,
};

export function VideosManager() {
  const { videos, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyVideo | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { alert('Title is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('videos').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('videos').insert(rest);
        if (error) throw error;
      }
      await refresh();
      setEditing(null);
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('videos').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleEnabled = async (video: VideoItem) => {
    try {
      const { error } = await supabase.from('videos').update({ is_enabled: !video.is_enabled }).eq('id', video.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Video Management"
        description="Add and manage videos for your portfolio"
        action={
          <button
            onClick={() => setEditing({ ...emptyVideo, display_order: videos.length + 1 })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Video
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <VideoIcon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{video.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{video.description}</p>
                {video.youtube_url && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">YouTube</p>}
                <div className="flex gap-1 mt-2">
                  <button onClick={() => toggleEnabled(video)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                    {video.is_enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => setEditing({ ...video })} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
                  <button onClick={() => setDeleteId(video.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {videos.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No videos yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Video' : 'Add Video'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} required />
              <TextField label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={3} />
              <TextField label="YouTube URL" value={editing.youtube_url} onChange={(v) => setEditing({ ...editing, youtube_url: v })} placeholder="https://youtube.com/watch?v=..." />
              <TextField label="Video File URL" value={editing.video_url} onChange={(v) => setEditing({ ...editing, video_url: v })} />
              <TextField label="Thumbnail URL" value={editing.thumbnail_url} onChange={(v) => setEditing({ ...editing, thumbnail_url: v })} />
              <TextField label="Display Order" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: parseInt(v) || 0 })} type="number" />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={editing.is_enabled} onChange={(e) => setEditing({ ...editing, is_enabled: e.target.checked })} className="w-4 h-4 rounded" />
                Enabled
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this video?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
