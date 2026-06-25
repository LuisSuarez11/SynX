import React from 'react';
import logoImg from '../../assets/synx_logo_new.png';

const SynxLogo = ({ className = "w-48 h-auto" }) => (
  <img 
    src={logoImg} 
    alt="SynX Logo" 
    className={`object-contain ${className}`}
  />
);

export default SynxLogo;
