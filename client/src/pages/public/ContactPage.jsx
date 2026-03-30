import usePageContent from '../../hooks/usePageContent.js';
import SectionRenderer from '../../components/sections/SectionRenderer.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';

const ContactPage = () => {
  const { page, loading, error } = usePageContent('contact');
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-64 h-8" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  return <SectionRenderer sections={page?.sections} />;
};

export default ContactPage;
