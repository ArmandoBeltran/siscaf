
import { useState } from 'react'
import {Link} from 'react-router-dom'
import '../assets/css/home.css';
import Header from '../components/Header';

import BtnHome from '../components/botones/btnHome'

function Home() {
  function saludo(){
    console.log('Hola');
  }
  return (
    
    <div className="home">
        <Header
      />
      <section className="Home-section " >
        <div className="container text-center my-5">
          <div className="m-0 row  " >
            <div className="col-12 col-md-6  p-5">
                <h2>Sistema Administrativo Andres</h2>
                
            </div>

            <div className="col-12 col-md-6  ">
                <img src="../logo_andres.png" alt="logo" />
            </div>
          </div>
        </div>
        
        
        <div className="container text-center my-4">
          <div className="row ">
            <div className="col-12 my-5 col-md-4 p-5  ">
              <Link to="/Administración">
                <BtnHome 
                  onClick={saludo} 
                  text="Administración" 
                />
              </Link>
            </div>
            
            <div className="col-12 my-5 col-md-4 p-5  ">
              <Link to="/Inventarios">
                <BtnHome 
                  onClick={saludo} 
                  text="Inventarios" 
                />
              </Link>
            </div>
            <div className="col-12 my-5 col-md-4 p-5  ">
              <Link to="/Ventas">
                <BtnHome 
                  onClick={saludo} 
                  text="Ventas" 
                />
              </Link>
            </div>
            {/*Plantilla */}
            {/* 
            <div className="col-12 ">
              <BtnHome 
                onClick={() => setView('otro')} 
                text="Otro Botón" 
              />
            </div> 
            */}
          </div>
        </div>

              
      </section>
    </div>
  );
}

export default Home