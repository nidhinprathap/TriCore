import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/ui/SectionWrapper.jsx';
import Button from '../../components/ui/Button.jsx';

const NotFoundPage = () => (
  <SectionWrapper className="min-h-[70vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold text-tc-primary mb-4">404</h1>
      <p className="text-xl text-tc-muted mb-8">Page not found</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  </SectionWrapper>
);

export default NotFoundPage;
