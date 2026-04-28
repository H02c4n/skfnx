import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import CalendarPreview from '@/components/events/CalendarPreview';
import AboutPreview from '@/components/home/AboutPreview';
import BoardSection from '@/components/home/BoardSection';

export default async function HomePage() {
  return (
    <>
      <Hero />
      <section className="section-padding">
        <div className="container-narrow">
          <Suspense fallback={<div className="text-center">Laddar evenemang...</div>}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>
      <section className="bg-secondary-100 dark:bg-gray-800 section-padding">
        <div className="container-narrow">
          <CalendarPreview />
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow">
          <AboutPreview />
        </div>
      </section>
      <section className="bg-primary-50 dark:bg-gray-900 section-padding">
        <div className="container-narrow">
          <BoardSection />
        </div>
      </section>
    </>
  );
}