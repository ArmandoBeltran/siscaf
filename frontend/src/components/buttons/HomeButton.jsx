import { Link } from 'react-router-dom'

import '../../assets/css/home_button.css'


const HomeButton = ({ route, img, alt, text, description }) => {
  return (
    <Link to={ route } className='home-button'>
      <div className="home-button-image">
        <img src={img} alt={alt} />
        <h4>{ text }</h4>
        <p>{ description }</p>
      </div>
    </Link>
  );
};

export default HomeButton