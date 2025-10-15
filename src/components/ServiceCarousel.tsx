"use client";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

type Service = {
  id: number;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  action: () => void;
  buttonText: string;
};

export default function ServiceCarousel({ services }: { services: Service[] }) {
  const css = `
  .ServiceCarousel {
    width: 100%;
    height: 420px;
    padding-bottom: 50px !important;
  }
  .ServiceCarousel .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 360px;
    display: flex;
    align-items: stretch;
  }
  .swiper-pagination-bullet {
    background-color: #000 !important;
  }
`;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="relative w-full max-w-5xl mx-auto px-4"
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={20}
        effect="coverflow"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: ".svc-next", prevEl: ".svc-prev" }}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        className="ServiceCarousel"
      >
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <SwiperSlide key={service.id}>
              <div className="group bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-blue-600/20 rounded-lg transition-colors duration-300">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                      <p className="text-blue-400 text-sm">{service.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{service.description}</p>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2 text-xs uppercase tracking-wide">Key Capabilities</h4>
                    <ul className="space-y-1 text-gray-400 text-xs">
                      {service.capabilities.slice(0, 3).map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <button onClick={service.action} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg">
                    {service.buttonText}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
          <button className="svc-prev bg-blue-600/80 hover:bg-blue-700 text-white p-2 rounded">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button className="svc-next bg-blue-600/80 hover:bg-blue-700 text-white p-2 rounded">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </Swiper>
    </motion.div>
  );
}
