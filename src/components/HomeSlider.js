import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";

// Import images
import image1 from '../Images/sliders/2022_OHDSI_meeting_WashingtonDC.jpg';
import image2 from '../Images/sliders/2023_Belfast Photo 1.jpeg';
// import image3 from '../Images/sliders/data_integration.jpeg';
// import image4 from '../Images/sliders/overview.jpeg';
import image5 from '../Images/sliders/ul-research-centre-Clifford_Culhane2.jpeg';

function HomeSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="slider-container">
        <Slider {...settings}>
        <div>
            <img src={image1} alt="OHDSI Meeting in Washington DC" />
            <div className="slide-caption">
            <h2>2022 OHDSI Meeting, Washington DC</h2>
            <p>Highlighting global collaboration and data science efforts.</p>
            </div>
        </div>
        <div>
            <img src={image2} alt="Belfast Event 2023" />
            <div className="slide-caption">
            <h2>2023 Belfast Photo</h2>
            <p>Key players behind the eHealth Hub project.</p>
            </div>
        </div>
        {/* <div>
            <img src={image3} alt="Data Integration Visual" />
            <div className="slide-caption">
            <h2>Data Integration Visual</h2>
            <p>Explaining the technology and data integration efforts.</p>
            </div>
        </div>
        <div>
            <img src={image4} alt="eHealth Hub Overview" />
            <div className="slide-caption">
            <h2>Overview</h2>
            <p>Unified harmonized health data for network cancer research studies.</p>
            </div>
        </div> */}
        <div>
            <img src={image5} alt="Research Leaders at UL Research Centre" />
            <div className="slide-caption">
            <h2>UL Research Centre</h2>
            <p>Key leaders in the research for eHealth Hub for Cancer.</p>
            </div>
        </div>
        </Slider>
    </div>
  );
}

export default HomeSlider;
