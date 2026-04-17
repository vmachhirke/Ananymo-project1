import Quiz from "./Quiz";
import { Link } from "react-router-dom";
function QuizHome() {
  return (
    <>
      <div className="container">
        <div className="row p-4 border mt-5">
          <div className="col-12 col-lg-6  p-4">
            <h1
              style={{ fontWeight: "900", fontSize: "50px", color: "#F1495B" }}>
              Elevate Your Coding
              <br /> Knowledge with Quiz
            </h1>
            <Link to='/quiz/view'>  <button className="btn btn-outline-danger  ">Start Quiz</button></Link>
          </div>

          <div className="col-12 col-lg-6">
            <lottie-player
              src="https://lottie.host/7c36f6af-5587-4ca7-b87f-9830554d6fd1/jnzZKbhxDy.json"
              speed="1"
              style={{ width: "100%" }}
              loop
              autoplay
              direction="1"
              mode="normal"></lottie-player>
          </div>
        </div>

        <div className="row  mt-4 p-3">
          <div className="col-8 border border-danger rounded-1 bg-danger-subtle p-2 m-1">
            <div className="row">
              <div className="col-4">
                <p>Programming Quiz</p>
              </div>
              <div className="col-4">
                <span className="rounded-pill bg-danger p-1 text-light float-end">
                  20
                </span>
              </div>
              <div className="col-4">
                <Link to='/quiz/view'><button className="btn btn-danger btn-sm">Start Quiz</button></Link>
              </div>
            </div>
            {/* <div className="row p-0 m-0">
              <p className="float-end m-0 p-0" style={{ fontWeight: "200" }}>
                created on
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* <dotlottie-player
        src="https://lottie.host/c90a58da-68c3-471b-926f-7a96a34a6703/MegjLIaA9P.json"
        background="transparent"
        speed="1"
        style={{ width: "100%" }}
        loop
        autoplay></dotlottie-player>

      <dotlottie-player
        src="https://lottie.host/5abed722-9267-48fd-9ae4-5cabd8891bf3/rU9SSvddCf.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay></dotlottie-player> */}

     
    </>
  );
}
export default QuizHome;
