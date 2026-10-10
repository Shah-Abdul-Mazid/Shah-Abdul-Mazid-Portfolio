import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationSection } from './CertificationSection';

interface CertificationsProps {
  addToRefs: (el: HTMLElement | null) => void;
}

const Certifications: React.FC<CertificationsProps> = ({ addToRefs }) => {
  const { data } = usePortfolio();
  const certifications = data.certifications || [];

  return (
    <section id="certifications" className="section">
      <div className="container">
        <div className="section-title fade-in" ref={addToRefs}>
          <span className="subtitle">{data.sections?.certifications?.subtitle || 'Certifications'}</span>
          <h2>
            {data.sections?.certifications?.title ? (
              <span dangerouslySetInnerHTML={{ __html: data.sections.certifications.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
            ) : (
              <>Licenses & <span className="gradient-text">Certifications</span></>
            )}
          </h2>
        </div>

        <CertificationSection 
          apiCertifications={certifications} 
          addToRefs={addToRefs} 
        />
      </div>
    </section>
  );
};

export default Certifications;
