// function About(){

//     return(
//         <div className="container p-3 p-lg-5 p-md-4 ">
//         <div className="col p-3 p-lg-5 p-md-4 bg-body-tertiary card">
//         <h3>About:</h3>
//             <p>
//             Ananymo is the dynamic knowledge-sharing community where tech enthusiasts, developers, and experts collaborate to collectively solve challenges and support each other's growth.
//             A community-based space to find and contribute answers to technical challenges.
//             A public platform building the definitive collection of coding questions & answers.

//             </p>

//             </div>
//         </div>
//     )
// }

// export default About;


function About() {
  return (
    <div className="container p-3 p-lg-5 p-md-4">
      
      {/* About Section */}
      <div className="card bg-body-tertiary p-3 p-lg-5 p-md-4 mb-4">
        <h2 className="mb-3">About Us</h2>
        
        <p>
          <strong>Ananymo</strong> is a student-focused knowledge-sharing platform built to help learners,
          developers, and tech enthusiasts grow together.
        </p>

        <p>
          Our mission is to create a supportive community where students can ask doubts,
          share knowledge, and help each other solve academic and technical problems.
        </p>

        <p>
          Whether you're working on college assignments, learning new technologies, or preparing for interviews,
          Ananymo provides a space where you can find solutions and contribute your own knowledge.
        </p>

        <p>
          We believe that learning becomes easier when students learn together.
        </p>
      </div>

      {/* Features Section */}
      <div className="card bg-body-tertiary p-3 p-lg-5 p-md-4 mb-4">
        <h3 className="mb-3">What You Can Do Here</h3>
        <ul>
          <li>Ask your academic or coding doubts</li>
          <li>Share your knowledge and help others</li>
          <li>Collaborate with students from different colleges</li>
          <li>Improve your problem-solving skills</li>
          <li>Explore solutions for real-world technical challenges</li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="card bg-body-tertiary p-3 p-lg-5 p-md-4">
        <h3 className="mb-3">Contact Us</h3>

        <p>If you have any questions, suggestions, or feedback, feel free to reach out:</p>

        <p><strong>Email:</strong> support@ananymo.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Location:</strong> India</p>

        <p className="mt-3">
          We are always open to improving our platform with your valuable feedback.
        </p>
      </div>

    </div>
  );
}

export default About;