import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const HomePage = () => {
  const { addToRefs } = useIntersectionObserver();

  return (
    <div className="app home-page-app">
      <IntelligenceMatrix />
      <Header />
      <main className="home-main-content">
        <Hero addToRefs={addToRefs} />
      </main>
      <Footer />
      <FloatingContactForm />
      <style>{`
        .home-page-app {
          height: 100vh;
          height: -webkit-fill-available;
          height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        .home-main-content {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
