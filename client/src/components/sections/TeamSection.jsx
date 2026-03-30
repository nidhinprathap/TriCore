import SectionWrapper from '../ui/SectionWrapper.jsx';
import Card from '../ui/Card.jsx';

const TeamSection = ({ data }) => (
  <SectionWrapper>
    <h2 className="text-3xl font-bold text-center mb-12">{data?.title || 'Our Team'}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.members?.map((m, i) => (
        <Card key={i} className="text-center">
          {m.photo && <img loading="lazy" src={m.photo} alt={m.name} className="w-24 h-24 mx-auto mb-4 rounded-full object-cover" />}
          <h3 className="font-bold">{m.name}</h3>
          {m.role && <p className="text-sm text-tc-primary">{m.role}</p>}
        </Card>
      ))}
    </div>
  </SectionWrapper>
);

export default TeamSection;
