import { useState } from 'react';
import SectionWrapper from '../ui/SectionWrapper.jsx';
import { ChevronDown } from 'lucide-react';

const FaqSection = ({ data }) => {
  const [open, setOpen] = useState(null);

  return (
    <SectionWrapper>
      <h2 className="text-3xl font-bold text-center mb-12">{data?.title || 'FAQ'}</h2>
      <div className="max-w-2xl mx-auto divide-y divide-tc-border">
        {data?.items?.map((item, i) => (
          <div key={i} className="py-4">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left">
              <span className="font-semibold">{item.question}</span>
              <ChevronDown size={18} className={`text-tc-dim transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="mt-3 text-sm text-tc-muted">{item.answer}</p>}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default FaqSection;
