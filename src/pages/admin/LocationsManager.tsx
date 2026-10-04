import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, MapPin, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';
import type { LocationItem } from '@/lib/types';

const emptyLocation = {
  id: '',
  label: '',
  address: '',
  city: '',
  state: '',
  country: '',
  google_maps_url: '',
  latitude: '',
  longitude: '',
  is_public: true,
};

export function LocationsManager() {
  const { locations, refresh } = usePortfolio();
  const [editing, setEditing] = useState<typeof emptyLocation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.label.trim()) { alert('Label is required'); return; }
    try {
      const { id, ...rest } = editing;
      if (id) {
        const { error } = await supabase.from('locations').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('locations').insert(rest);
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
      const { error } = await supabase.from('locations').delete().eq('id', deleteId);
      if (error) throw error;
      await refresh();
      setDeleteId(null);
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const togglePublic = async (loc: LocationItem) => {
    try {
      const { error } = await supabase.from('locations').update({ is_public: !loc.is_public }).eq('id', loc.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Location Management"
        description="Manage your location information"
        action={
          <button
            onClick={() => setEditing({ ...emptyLocation })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            Add Location
          </button>
        }
      />

      <div className="space-y-3">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{loc.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {[loc.address, loc.city, loc.state, loc.country].filter(Boolean).join(', ')}
                </p>
                <div className="flex gap-2 mt-1">
                  {loc.is_public ? (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">Public</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500">Private</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => togglePublic(loc)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  {loc.is_public ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing({ ...loc })} className="px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-all text-xs">Edit</button>
                <button onClick={() => setDeleteId(loc.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {locations.length === 0 && (
          <Card><p className="text-center text-gray-500 dark:text-gray-400 py-8">No locations yet.</p></Card>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editing.id ? 'Edit Location' : 'Add Location'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <TextField label="Label" value={editing.label} onChange={(v) => setEditing({ ...editing, label: v })} required placeholder="e.g. Home, Office" />
              <TextField label="Address" value={editing.address} onChange={(v) => setEditing({ ...editing, address: v })} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="City" value={editing.city} onChange={(v) => setEditing({ ...editing, city: v })} />
                <TextField label="State" value={editing.state} onChange={(v) => setEditing({ ...editing, state: v })} />
              </div>
              <TextField label="Country" value={editing.country} onChange={(v) => setEditing({ ...editing, country: v })} />
              <TextField label="Google Maps URL" value={editing.google_maps_url} onChange={(v) => setEditing({ ...editing, google_maps_url: v })} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Latitude" value={editing.latitude} onChange={(v) => setEditing({ ...editing, latitude: v })} />
                <TextField label="Longitude" value={editing.longitude} onChange={(v) => setEditing({ ...editing, longitude: v })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={editing.is_public} onChange={(e) => setEditing({ ...editing, is_public: e.target.checked })} className="w-4 h-4 rounded" />
                Visible on public website
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} message="Delete this location?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
