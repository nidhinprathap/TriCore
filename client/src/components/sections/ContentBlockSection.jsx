import SectionWrapper from '../ui/SectionWrapper.jsx';

const ContentBlockSection = ({ data }) => (
  <SectionWrapper>
    {data?.title && <h2 className="text-3xl font-bold mb-6">{data.title}</h2>}
    {data?.body && <div className="text-tc-muted leading-relaxed max-w-3xl whitespace-pre-wrap">{data.body}</div>}
    {data?.image && <img loading="lazy" src={data.image} alt={data.title || ''} className="mt-8 w-full max-w-3xl" />}
  </SectionWrapper>
);

export default ContentBlockSection;
