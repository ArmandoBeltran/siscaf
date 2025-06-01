
import { useState } from 'react'
import {Link} from 'react-router-dom'
import '../assets/css/home.css';

import BtnHome from '../components/botones/btnHome'

function Home() {
  function saludo(){
    console.log('Hola');
  }

  return (
    <div className="home">
      <section className="Home-section " >
        <div className="m-0 row justify-content-center align-items-center" >
          <div className="col-auto text-center border p-5">
              <h2>Sistema Administrativo Andres</h2>
              
          </div>
          <div className="col-auto justify-content-center border">
              <img src="../logo_andres.png" alt="logo" />
          </div>
        </div>
      <div className="container text-center my-4">
        <div className="row justify-content-center g-3">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/Administración">
              <BtnHome 
                onClick={saludo} 
                text="Administración" 
              />
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/Inventarios">
              <BtnHome 
                onClick={saludo} 
                text="Inventarios" 
              />
            </Link>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Link to="/Ventas">
              <BtnHome 
                onClick={saludo} 
                text="Ventas" 
              />
            </Link>
          </div>
          {/*Plantilla */}
          {/* 
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
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