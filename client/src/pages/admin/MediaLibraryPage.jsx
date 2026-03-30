import { useState, useEffect } from 'react';
import { getAssets, uploadImage, deleteAsset } from '../../api/uploadApi.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Upload, Trash2, Copy } from 'lucide-react';

const MediaLibraryPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetch = () => { getAssets({ limit: 50 }).then((res) => setAssets(res.data.assets)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try { await uploadImage(formData); fetch(); } catch (err) { alert('Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await deleteAsset(id);
      fetch();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete');
    }
  };
  const handleCopy = (url) => { navigator.clipboard.writeText(url); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <label className="cursor-pointer">
          <Button size="sm" as="span" disabled={uploading}><Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}</Button>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i)=><Skeleton key={i} className="aspect-square" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div key={asset._id} className="group relative border border-tc-border overflow-hidden">
              <img loading="lazy" src={asset.url} alt={asset.alt} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleCopy(asset.url)} className="p-2 bg-white/10 text-white hover:bg-white/20"><Copy size={14} /></button>
                <button onClick={() => handleDelete(asset._id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30"><Trash2 size={14} /></button>
              </div>
              <p className="text-[10px] text-tc-dim p-2 truncate">{asset.originalName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
