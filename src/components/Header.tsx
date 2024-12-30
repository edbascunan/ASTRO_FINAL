import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { projectCategories } from '../data/projects';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path.startsWith('/#')) {
      // Si es un enlace de anclaje en la página principal
      if (location.pathname === '/') {
        // Si ya estamos en la página principal, solo navegamos al anclaje
        const element = document.querySelector(path.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Si no estamos en la página principal, navegamos a la página principal y luego al anclaje
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsProjectsOpen(false);
  }, [location]);

  // Manejar clics fuera del menú de proyectos
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const services = [
    { title: 'Modelos 3D', href: '/servicios/modelos-3d' },
    { title: 'Cubicaciones', href: '/servicios/cubicaciones' },
    { title: 'Presupuestos', href: '/servicios/presupuestos' },
    { title: 'Coordinación BIM', href: '/servicios/coordinacion-bim' }
  ];

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-white hover:text-red-600 transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavigation('/#about')}
              className="text-white hover:text-red-600 transition-colors"
            >
              Nosotros
            </button>
            <div 
              className="relative"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
              ref={projectsRef}
            >
              <button 
                className="text-white hover:text-red-600 transition-colors flex items-center space-x-1"
              >
                <span>Proyectos</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div 
                className={`absolute top-full right-0 mt-2 w-64 bg-black rounded-lg shadow-xl py-2 ${isProjectsOpen ? 'block' : 'hidden'}`}
              >
                {projectCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleNavigation(`/proyectos/${category.id}`);
                      setIsProjectsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-red-600 transition-colors"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleNavigation('/#contact')}
              className="text-white hover:text-red-600 transition-colors"
            >
              Contacto
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
