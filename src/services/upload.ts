import { supabase, STORAGE_BUCKET } from '@/lib/supabase';

export async function uploadFile(
  file: File,
  folder: string,
  filename?: string
): Promise<{ url: string; path: string; error: string | null }> {
  const ext = file.name.split('.').pop();
  const name = filename || `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const path = `${folder}/${name.split('/').pop()}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) {
    return { url: '', path: '', error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return { url: urlData.publicUrl, path, error: null };
}
