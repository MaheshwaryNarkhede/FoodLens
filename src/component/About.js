import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import './styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navigation />
      <main className="about-content">
        <h1>About FoodLens</h1>
        <p>FoodLens is your go-to app for exploring detailed information about various foods.</p>
        {/* Add more about content as needed */}
      </main>
      <Footer />
    </div>
  );
};

export default About;
