import Header from '../components/Header';
import Papers from '../components/Papers';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const PublicationsPage = () => {
  const { addToRefs } = useIntersectionObserver();

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main>
        <Papers addToRefs={addToRefs} />
      </main>
      <Footer />
      <FloatingContactForm />
    </div>
  );
};

export default PublicationsPage;
