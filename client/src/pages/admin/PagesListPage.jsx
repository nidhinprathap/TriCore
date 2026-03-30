import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPages } from '../../api/adminContentApi.js';
import Card from '../../components/ui/Card.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { FileText, ChevronRight } from 'lucide-react';

const PagesListPage = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPages().then((res) => setPages(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pages</h1>
      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Link key={page._id} to={`/admin/pages/${page.slug}`}>
              <Card className="flex items-center justify-between hover:border-tc-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-tc-primary" />
                  <div>
                    <p className="font-semibold">{page.title}</p>
                    <p className="text-xs text-tc-dim">/{page.slug}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-tc-dim" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PagesListPage;
