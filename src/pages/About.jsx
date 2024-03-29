import React from "react";
import { useNavigate } from "react-router-dom";

// About page
const About = () => {
  const navigate = useNavigate();

  return (
    <div className="contentmypage">
      <div className="container-fluid bg-dark rounded-3 text-white p-5 about">
        <div className="container bg-dark p-5">
          <h1 className="display-4 fw-bold">Welcome to Show ME!!!</h1>
          <p>
            Have you ever heard someone, perhaps your teacher, remark that your
            writing is boring? How can you write more interestingly? Well, Show
            ME can help you do just that! Instead of writing dull elementary
            sentences, learn and practice writing vivid and exciting sentences.
            Don't tell, but show instead! Paint a picture in the readers' minds
            with mere words. Start today!{" "}
          </p>
          <a
            href="#"
            onClick={() => navigate("/MyPage")}
            className="btn btn-primary joinbutton"
          >
            Join Us!
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
