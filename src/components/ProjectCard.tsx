import React, { useEffect, useRef, useState } from 'react';
import type { Project } from '../types/projects';

interface ProjectCardProps extends Project {}

export const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const slides = cardElement.querySelectorAll<HTMLElement>('[data-carousel-slide]');
    const prevBtn = cardElement.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const nextBtn = cardElement.querySelector<HTMLButtonElement>('[data-carousel-next]');

    const nextSlide = (e?: MouseEvent) => {
      e?.stopPropagation();
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = (e?: MouseEvent) => {
      e?.stopPropagation();
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-advance carousel
    const interval = setInterval(nextSlide, 5000);

    // Event listeners
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    return () => {
      clearInterval(interval);
      prevBtn?.removeEventListener('click', prevSlide);
      nextBtn?.removeEventListener('click', nextSlide);
    };
  }, []);

  // Auto-return from flipped state after 30 seconds
  useEffect(() => {
    if (!isFlipped) return;

    const timeout = setTimeout(() => {
      setIsFlipped(false);
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isFlipped]);

  const isDefaultModel = !props.modelUrl || props.modelUrl.trim() === '';
  const images = [props.imageUrl];
  if (props.details?.additionalImages) {
    images.push(...props.details.additionalImages);
  }

  return (
    <div ref={cardRef} className={`bg-white rounded-xl shadow-lg overflow-hidden group flip-card ${isFlipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">
        {/* Front side */}
        <div className="flip-card-front">
          {/* Carousel */}
          <div className="relative overflow-hidden aspect-video">
            {images.map((image, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-500"
                data-carousel-slide={index}
                style={{ opacity: index === currentSlide ? 1 : 0 }}
              >
                <img
                  src={image}
                  alt={`${props.title} - Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                data-carousel-prev
                title="Imagen anterior"
                aria-label="Ver imagen anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                data-carousel-next
                title="Siguiente imagen"
                aria-label="Ver siguiente imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{props.title}</h3>
            <p className="text-gray-600 mb-4">{props.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {props.services.map((service) => (
                <span key={service} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {service}
                </span>
              ))}
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong>Cliente:</strong> {props.details.client}</p>
              <p><strong>Fecha:</strong> {props.details.date}</p>
              <p><strong>Ubicación:</strong> {props.details.location}</p>
            </div>
          </div>

          {/* Model Button */}
          <button
            className={`absolute bottom-4 right-4 ${isDefaultModel ? 'bg-gray-900 hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'} text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 z-10`}
            onClick={() => setIsFlipped(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isDefaultModel ? (
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              ) : (
                <>
                  <path d="M12 3v19"/>
                  <path d="M5 10h14"/>
                  <path d="M5 15h14"/>
                </>
              )}
            </svg>
            <span>{isDefaultModel ? 'Ver Servicio' : 'Ver Modelo 3D'}</span>
          </button>
        </div>

        {/* Back side */}
        <div className="flip-card-back bg-white">
          {isDefaultModel ? (
            <div className="p-6 flex items-center justify-center h-full">
              <p className="text-gray-700">
                Este proyecto ofrece los siguientes servicios: {props.services.join(', ')}. {props.description}
              </p>
            </div>
          ) : (
            <iframe
              src={props.modelUrl}
              className="w-full h-full border-0"
              allowFullScreen
            />
          )}
          <button
            className={`absolute bottom-4 right-4 ${isDefaultModel ? 'bg-gray-900 hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2`}
            onClick={() => setIsFlipped(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9l-6 6"/>
              <path d="M9 9h5v5"/>
            </svg>
            <span>Ver Descripción</span>
          </button>
        </div>
      </div>
    </div>
  );
};
