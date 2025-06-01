import React from 'react';
import styles from './btnHome.module.css'

const BtnHome = ({ onClick, text }) => {
  return (
    <button 
      onClick={onClick} 
      className={styles.button}
    >
      {text}
    </button>
  );
};

export default BtnHome;