import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PerformanceSection from '@/components/PerformanceSection';
import UseCasesSection from '@/components/UseCasesSection';
import CredibilitySection from '@/components/CredibilitySection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PerformanceSection />
        <UseCasesSection />
        <CredibilitySection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}