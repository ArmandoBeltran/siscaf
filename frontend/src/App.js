
import Home from './pages/home'
import Admin from './pages/Admin'
import { BrowserRouter, Routes, Route } from "react-router-dom";


//Archivo Raiz, colocar las paginas aqui con su ruta
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Administración" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
