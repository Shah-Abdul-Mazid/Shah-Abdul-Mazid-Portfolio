import React from 'react';
import { MapPin, Mail, Phone, Linkedin, Github } from 'lucide-react';
import { cvData } from '../../data/cvData';

export const CVHeader: React.FC = () => {
    const { personal } = cvData;

    return (
        <header className="cv-header-band">
            <div className="cv-header-info">
                <h1 className="cv-name">{personal.name}</h1>
                <h2 className="cv-subtitle">{personal.title}</h2>
                <div className="cv-tags">
                    {personal.tags.join(' \u00A0|\u00A0 ')}
                </div>
                <div className="cv-contact-grid">
                    <span className="cv-contact-item">
                        <MapPin size={11} /> {personal.location}
                    </span>
                    <span className="cv-contact-item">
                        <Mail size={11} />{' '}
                        <a href={`mailto:${personal.email}`}>{personal.email}</a>
                    </span>
                    <span className="cv-contact-item">
                        <Phone size={11} /> {personal.phone}
                    </span>
                    <span className="cv-contact-item">
                        <Linkedin size={11} />{' '}
                        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                        </a>
                    </span>
                    <span className="cv-contact-item">
                        <Github size={11} />{' '}
                        <a href={personal.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                    </span>
                </div>
            </div>
            <div className="cv-header-avatar-box">
                <img src={personal.avatarUrl} alt={personal.name} className="cv-avatar" />
            </div>
        </header>
    );
};

export default CVHeader;
