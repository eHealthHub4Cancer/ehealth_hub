import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Slider.css";

// Import images
import image1 from '../Images/sliders/2022_OHDSI_meeting_WashingtonDC.jpg';
import image2 from '../Images/sliders/2023_Belfast Photo 1.jpeg';
import image5 from '../Images/sliders/ul-research-centre-Clifford_Culhane2.jpeg';

const CustomPrevArrow = ({ onClick }) => (
  <button className="slick-arrow slick-prev custom-arrow prev-arrow" onClick={onClick}>
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="slick-arrow slick-next custom-arrow next-arrow" onClick={onClick}>
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </button>
);

function HomeSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    appendDots: dots => (
      <div className="dots-container">
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="custom-dot"></div>
    )
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        <Slider {...settings}>
          <div className="slide">
            <div className="slide-image-container">
              <img src={image1} alt="OHDSI Meeting in Washington DC" />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-caption">
              <div className="caption-content">
                <h2>2022 OHDSI Meeting, Washington DC</h2>
                <div className="caption-divider"></div>
                <p>Highlighting global collaboration and data science efforts in healthcare transformation.</p>
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="slide-image-container">
              <img src={image2} alt="Belfast Event 2023" />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-caption">
              <div className="caption-content">
                <h2>2023 Belfast Photo</h2>
                <div className="caption-divider"></div>
                <p>Pioneering minds behind the eHealth Hub project shaping the future of healthcare.</p>
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="slide-image-container">
              <img src={image5} alt="Research Leaders at UL Research Centre" />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-caption">
              <div className="caption-content">
                <h2>UL Research Centre</h2>
                <div className="caption-divider"></div>
                <p>Key leaders driving innovation in eHealth Hub for Cancer research and development.</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default HomeSlider;