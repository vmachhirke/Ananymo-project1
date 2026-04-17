import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, child, set, get, push, runTransaction } from "firebase/database";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";
import ScanAbusive from "./ScanAbusive";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [uid, setUID] = useState();
  const [isLoggedin, setisLoggedin] = useState(false);
  const [q_id, setQid] = useState(1);

const [isLoading, setIsLoading] = useState(false);
const [successMessage, setSuccessMessage] = useState('');
const [d,setD]=useState(false)
const [isDataLoaded,setDataLoaded]=useState(false);
const [isAbusive,setIsAbusive]=useState()
const [isAbusiveDesc,setAbusiveDesc]=useState();

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setDataLoaded(true);
      if (user) {
        setUID(user.uid);
        setisLoggedin(true);
      } else {
        setisLoggedin(false);
      }
    });
  }, [isLoggedin]);


  function submitQue(question) {
    if (title === "") {
      alert("Title must be non-empty");
      return;
    }
    // if (desc === "") {
    //   alert("Body must be non-empty");
    //   return;
    // }
    if (!isLoggedin) {
      alert("Login first");
      return;
    }
    if(isAbusive){
      alert("Don't use abusive words!");
      return;
    }
    if(isAbusiveDesc){
      alert("Don't use abusive words!");
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    const db = getDatabase();
    const date = new Date().toString();
  
    const qRef = ref(db, 'questions');
    const newQRef = push(qRef); // Generate a unique child key
    const newQId = newQRef.key;
  
    set(newQRef, {
      uid: uid,
      q_id: newQId,
      title: title,
      desc: desc,
      ans_count: 0,
      vote_count: 0,
      date: date,
      tags: "",
      views: 0,
      likes:0,
      dislikes:0,
    }).then(() => {
      setSuccessMessage('Question successfully posted!');
      setIsLoading(false);
    }).catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
  }

  useEffect(()=>{

  setIsAbusive(ScanAbusive(title))
  // console.log(isAbusive)

  }, [title])

  useEffect(()=>{
    setAbusiveDesc(ScanAbusive(desc))
    // console.log(isAbusiveDesc)

    }, [desc])
  
  return (
    <>
      <div className="container p-3">
        <div className="row">
          <div className="col-12 col-lg-8 card p-3">
            <h3>Ask your Question?</h3>
            {/* <form action={this}> */}

            <div className="form-container mt-2 mb-2 card p-3">
              <label
                htmlFor="title"
                className="ms-1 mb-2"
                style={{ fontSize: "12px", fontWeight: "400" }}>
                <h6 className="m-0">Title</h6>
                Be specific and imagine you’re asking a question to another
                person.
              </label>
              <input
                className={`form-control form-control-sm ${isAbusive ? "is-invalid": title.length>20? "is-valid":""}`}
                type="text"
                name="title"
                id="title"
                placeholder={
                  "e.g. Is there an R function for finding the index of an element in a vector?"
                }
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }} required
              />
              { title&&
              <div className={`${isAbusive ? "invalid-feedback":"valid-feedback"}`} style={{fontWeight:"350"}}>
                {isAbusive ? "Question contains abusive Language!": "Ready to post question"}
              </div>}
            </div>

            <div className="form-container mt-2 mb-2 card p-3">
              <label
                htmlFor="desc"
                className="ms-1 mb-2"
                style={{ fontSize: "12px", fontWeight: "400" }}>
                <h6 className="m-0">Body</h6>
                The body of your question contains your problem details and
                results. Minimum 220 characters.
              </label>
              <textarea
                className={`form-control form-control-sm ${isAbusiveDesc ? "is-invalid": desc.length>50? "is-valid":""}`}
                id="desc"
                rows="6"
                placeholder="Explain how you encountered the problem you’re trying to solve, and any difficulties that have prevented you from solving it yourself."
                value={desc}
                onChange={(event) => {
                  setDesc(event.target.value);
                }}
                required></textarea>
                { desc&&
              <div className={`${isAbusiveDesc ? "invalid-feedback":"valid-feedback"}`} style={{fontWeight:"350"}}>
                {isAbusiveDesc ? "Question body contains abusive Language!":"Ready to post question"}
              </div>}
            </div>

            {
              //subject/category
            }
            <button
              type="submit"
              className="btn btn-dark w-100 mt-3 "
              onClick={submitQue}
              // data-bs-toggle="modal"
              // data-bs-target="#spinner" 
              disabled={isLoading} >
              {isLoading ? 'Please wait...' : 'ASK YOUR QUESTION'}
            </button>
            {successMessage && <div className="alert alert-success mt-3" role="alert">
            
                {successMessage}</div>}
            {/* </form> */}

          </div>

  
          <div className="col-12 col-lg-4 card">
            <lottie-player
              src="https://lottie.host/233628cb-07bb-46ab-ba40-fcd2dd3d46b5/mwPQdYs1cK.json"
              background="#ffff"
              speed="1"
              style={{ height: "100%" }}
              loop
              autoplay
              direction="1"
              mode="normal"></lottie-player>
          </div>
        </div>
      </div>

      {/* modalwithspinner */}

      {!isLoading ? <Spinner display='d-none'/> : <Spinner display='d-block'/>}
    </>
  );
}
export default AskQuestion;