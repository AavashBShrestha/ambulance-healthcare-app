import React from "react";

function Index() {
  const features = [
    { icon: "fa-ambulance", title: "Ambulance Booking", description: "Find and book the nearest available ambulance instantly." },
    { icon: "fa-hospital", title: "Hospital Resources", description: "Check hospital availability, bed counts, and doctor schedules." },
    { icon: "fa-hand-holding-medical", title: "Blood Donation", description: "Request or donate blood and locate nearby blood banks easily." }
  ];

  return (
    <div className="home-container">
      <HeroSection />
      <FeatureSection features={features} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <h1>Emergency Healthcare Assistance</h1>
        <p>Get real-time healthcare support at your fingertips.</p>
        <button className="cta-button">Find Help Now</button>
      </div>
    </section>
  );
}

function FeatureSection({ features }) {
  return (
    <section className="features">
      {features.map((feature, index) => (
        <FeatureBox key={index} icon={feature.icon} title={feature.title} description={feature.description} />
      ))}
    </section>
  );
}

function FeatureBox({ icon, title, description }) {
  return (
    <div className="feature-box">
      <i className={`fas ${icon}`}></i>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default Index;
