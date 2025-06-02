
import { useState } from 'react'
import {Link} from 'react-router-dom'

import adminImg from '../assets/img/botones/adminImg.png'
import invImg from '../assets/img/botones/invImg.png'
import ventasImg from '../assets/img/botones/ventasImg.png'

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
            <div className="container col-12 my-5 col-md-4 p-5 mx-sm-0 mx-lg-0">
              <div className="row">
                <Link to="/Administración" className="text-decoration-none">
                  <BtnHome 
                    onClick={saludo} 
                    text ={"Administracion"}
                    img= {adminImg}
                  />
              </Link>
              </div>
            </div>
            
            <div className="col-12 my-5 col-md-4 p-5 " >
              <Link to="/Inventarios" className="text-decoration-none ">
                <BtnHome 
                  onClick={saludo} 
                  text="Inventarios" 
                  img= {invImg}
                />
              </Link>
            </div>
            <div className="col-12 my-5 col-md-4 p-5  " >
              <Link to="/Ventas" className="text-decoration-none">
                <BtnHome 
                  onClick={saludo} 
                  text="Ventas" 
                  img= {ventasImg}
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