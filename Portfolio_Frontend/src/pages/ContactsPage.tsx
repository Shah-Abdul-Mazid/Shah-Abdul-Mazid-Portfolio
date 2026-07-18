import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ContactsPage = () => {
  const { addToRefs } = useIntersectionObserver();

  return (
    <div className="app">
      <IntelligenceMatrix />
      <Header />
      <main>
        <Contact addToRefs={addToRefs} />
      </main>
      <Footer />
      <FloatingContactForm />
    </div>
  );
};

export default ContactsPage;
