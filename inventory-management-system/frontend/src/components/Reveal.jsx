import { useScrollReveal } from '../hooks/useScrollReveal';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default Reveal;
