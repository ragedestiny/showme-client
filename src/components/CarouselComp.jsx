import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/esm/Container";

function CarouselComp(props) {
  // Carousel in front page
  return (
    <Container fluid>
      <Carousel className="carousel" variant="dark">
        {props.sliderdata.map((entry, index) => {
          return (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 carousel-image"
                src={entry.picture}
                alt={index + 1}
              />
              <Carousel.Caption>
                <h4>{entry.tell}</h4>
                <p className="subtext">{entry.title}</p>
                <h3>{entry.show}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Container>
  );
}

export default CarouselComp;
