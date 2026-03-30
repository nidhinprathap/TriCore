import { useState } from 'react';
import { uploadImage } from '../../api/uploadApi.js';
import { Upload, X, Image } from 'lucide-react';

const ImageUpload = ({ label, value, onChange, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      onChange(res.data.url);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => onChange('');

  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-tc-muted mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group">
          <img loading="lazy" src={value} alt="" className="w-full h-40 object-cover border border-tc-border" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer p-2 bg-white/10 text-white hover:bg-white/20 transition-colors">
              <Upload size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            <button onClick={handleClear} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center gap-2 h-40 border border-dashed border-tc-border hover:border-tc-primary/50 transition-colors">
          {uploading ? (
            <span className="text-xs text-tc-muted animate-pulse">Uploading...</span>
          ) : (
            <>
              <Image size={24} className="text-tc-dim" />
              <span className="text-xs text-tc-dim">Click to upload</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default ImageUpload;
