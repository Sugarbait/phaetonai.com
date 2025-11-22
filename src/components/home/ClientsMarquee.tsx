import React from 'react';

interface Client {
  name: string;
  logo: string;
  width?: number; // Optional custom width for logo
}

const ClientsMarquee = () => {
  // Client logos
  const clients: Client[] = [
    { name: 'MedEX Health Services', logo: '/clients/medex.png', width: 110 },
    { name: 'ARTILEF Brand Architects', logo: '/clients/artilef.png', width: 200 },
    { name: 'CareXps', logo: '/clients/carexps.png', width: 200 },
    { name: 'NexaSync', logo: '/clients/nexasync.png', width: 180 },
    { name: 'Techsolated', logo: '/clients/techsolated.avif', width: 180 },
  ];

  // Duplicate the clients array for seamless loop
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="pt-12 sm:pt-16 pb-6 sm:pb-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title">
            Trusted by These Organizations
          </h2>
          <p className="section-subtitle">
            Empowering businesses worldwide with cutting-edge AI solutions
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Marquee */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee hover:pause-marquee">
              {duplicatedClients.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 mx-6 sm:mx-8 md:mx-12 flex items-center justify-center"
                  style={{ width: client.width || 120 }}
                >
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="h-12 sm:h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 filter brightness-0"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
