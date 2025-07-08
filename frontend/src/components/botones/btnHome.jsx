import React from 'react';
import styles from './btnHome.module.css'

const BtnHome = ({ onClick,text,img }) => {
  return (
    <div className={styles.button + "container bg-dark "}>
      <div onClick={onClick} className="title row">
        <i>
          <img src={img}alt="" width={70} height={70}/>
        </i>
        <div >
            {text}
        </div>
      </div>
    </div>
  );
};

export default BtnHome;