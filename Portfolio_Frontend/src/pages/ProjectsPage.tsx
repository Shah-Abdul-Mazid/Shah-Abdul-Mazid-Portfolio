import Header from '../components/Header';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ProjectsPage = () => {
  const { addToRefs } = useIntersectionObserver();

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main>
        <Projects addToRefs={addToRefs} />
      </main>
      <Footer />
      <FloatingContactForm />
    </div>
  );
};

export default ProjectsPage;
