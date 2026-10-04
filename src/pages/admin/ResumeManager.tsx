import { useState, useEffect } from 'react';
import { FileDown, Upload, Trash2, FileText, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePortfolio } from '@/hooks/usePortfolio';
import { uploadFile } from '@/services/upload';
import { AdminPageHeader, TextField, Card, ConfirmDialog } from '@/components/admin/AdminUI';

export function ResumeManager() {
  const { resume, refresh } = usePortfolio();
  const [filename, setFilename] = useState('resume.pdf');
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (resume?.filename) setFilename(resume.filename);
  }, [resume]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const { url, error } = await uploadFile(file, 'resume');
      if (error) throw new Error(error);

      // Delete existing resume record if any
      if (resume?.id) {
        await supabase.from('resume').delete().eq('id', resume.id);
      }

      const { error: insertError } = await supabase.from('resume').insert({
        file_url: url,
        filename: file.name,
        file_size: file.size,
      });
      if (insertError) throw insertError;

      await refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume?.id) return;
    try {
      const { error } = await supabase.from('resume').delete().eq('id', resume.id);
      if (error) throw error;
      await refresh();
      setDeleteConfirm(false);
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUpdateFilename = async () => {
    if (!resume?.id) return;
    try {
      const { error } = await supabase.from('resume').update({ filename }).eq('id', resume.id);
      if (error) throw error;
      await refresh();
    } catch (err) {
      alert(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Resume Management" description="Upload, replace, or delete your resume file" />

      {uploadError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {uploadError}
        </div>
      )}

      {resume?.file_url ? (
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <FileText size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{resume.filename}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Size: {(resume.file_size / 1024).toFixed(1)} KB
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  <Download size={16} />
                  Download
                </a>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-all cursor-pointer">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Replace'}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              <div className="mt-6 flex gap-3 items-end">
                <div className="flex-1">
                  <TextField label="Filename" value={filename} onChange={setFilename} />
                </div>
                <button
                  onClick={handleUpdateFilename}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FileDown size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Resume Uploaded</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Upload your resume to make it available for download on your portfolio.</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all cursor-pointer shadow-lg">
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload Resume'}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={deleteConfirm}
        message="Delete your resume? This will remove it from the public website."
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
