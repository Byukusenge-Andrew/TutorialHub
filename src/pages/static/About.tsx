import React from 'react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">About TutorialHub</h1>
      
      <div className="prose max-w-none space-y-6">
        <p className="text-lg">
          TutorialHub is a comprehensive learning platform designed to help developers
          master new skills through interactive tutorials and hands-on practice.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
        <p>
          We believe in making high-quality programming education accessible to everyone.
          Our platform combines structured learning paths with practical exercises to
          ensure effective skill development.
        </p>

        <h2 className="text-2xl font-semibold mt-8">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Interactive Programming Tutorials</li>
          <li>Real-world Project Examples</li>
          <li>Community-driven Learning</li>
          <li>Progress Tracking</li>
          <li>Typing Practice for Developers</li>
          <li>DSA Challenges</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Join Our Community</h2>
        <p>
          Whether you're a beginner or an experienced developer, TutorialHub provides
          the resources you need to grow your skills and advance your career in
          software development.
        </p>
      </div>
    </div>
  );
}
