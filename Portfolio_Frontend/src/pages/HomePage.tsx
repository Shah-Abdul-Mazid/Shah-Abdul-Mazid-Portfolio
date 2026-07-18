import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const HomePage = () => {
  const { addToRefs } = useIntersectionObserver();

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main>
        <Hero addToRefs={addToRefs} />
      </main>
      <Footer />
      <FloatingContactForm />
    </div>
  );
};

export default HomePage;
