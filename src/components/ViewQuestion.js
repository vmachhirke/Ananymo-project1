import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

import {
  getDatabase,
  ref,
  get,
  child,
  update,
  onValue,
  set,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {AnswerList,AnswerListLoading} from "./AnswerList";
import Spinner from "./Spinner";
import ScanAbusive from "./ScanAbusive";
import MarkdownRender from "./MarkdownRender";

function ViewQuestion(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qidp = queryParams.get("qid");
  const [qid, setQid] = useState(qidp);
  const [qData, setQData] = useState([]);
  const [quid, setQuid] = useState();
  const [pp, setPP] = useState();
  const [voteCount, setVoteCount] = useState(0);
  const [hasVotedUp, setHasVotedUp] = useState(false);
  const [hasVotedDown, setHasVotedDown] = useState(false);
  const [ansData, setAnsData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [ansBody, setAnsBody] = useState("");
  const [isLoggedin, setisLoggedin] = useState(false);
  const [uid, setUID] = useState("");
  const [voteValue, setVoteValue] = useState(0);
  const [ansCount, setAnsCount] = useState(0);
  const [isDataLoaded,setDataLoaded]=useState(false);
  const [valLoaded,setValLoaded]=useState(false)
  const [voteLoaded,setVoteLoaded]=useState(false);
  const [sortBy, setSortBy] = useState("scoredesc");


  const auth = getAuth();
  const database = getDatabase();
  const questionRef = useRef(ref(database, `questions/${qid}`)); 

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const snapshot = await get(questionRef.current);
        if (snapshot.exists()) {
          var views = snapshot.val().views || 0;
          await update(questionRef.current, { views: views + 1 });
        }
      } catch (e) {
        console.log(e);
      }
    };
    updateViewCount();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUID(user.uid);
        setPP(user.photoURL);
        setisLoggedin(true);
      } else {
        setisLoggedin(false);
      }
    });
  }, [isLoggedin]);

  {
    /* question data */
  }

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "questions");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((child) => {
          if (child.val().q_id === qid) {
            setQuid(child.val().uid);
            data.push({
              key: child.key,
              uid: child.val().uid,
              duid: child.val().uid.slice(0, 8),
              q_id: child.val().q_id,
              title: child.val().title,
              desc: child.val().desc,
              ans_count: child.val().ans_count,
              vote_count: child.val().vote_count,
              date: child.val().date.match(/^\w+\s\w+\s\d+/)[0],
              tags: "",
              views: child.val().views,
            });
          }
        });
        setQData(data);
        setDataLoaded(true)
      }
    });
    return () => unsubscribe();
  }, [qid]);

  const dbvote = getDatabase();
useEffect(() => {

  if(isLoggedin){
    onValue(ref(dbvote, "votes/" + qid + uid ) , (ss) => {
      if (ss.exists()) {
        var value = ss.val().value;
        setVoteValue(value); 
        console.log(value);
        setVoteLoaded(true);

      }else {
     set(ref(dbvote, "votes/" + qid + uid) , {
          uid: uid,
          q_id: qid,
          vote_id: qid + uid,
          value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
        setVoteLoaded(true);
      }


});

  }else{
    console.log("this is why i am geting error")
  }
  }, [isLoggedin]);

  

  {
    /*Answers Data*/
  }
  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "answers");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = [];
          snapshot.forEach((child) => {
            if (child.val().q_id == qid) {
              data.push({
                ans_id:child.val().ans_id,
                uid: child.val().uid,
                pp: child.val().pp,
                ansBody: child.val().ansBody,
                vote_count: child.val().vote_count,
                date: child.val().date.match(/^\w+\s\w+\s\d+/)[0],
              });
            }
          });
          setAnsData(data);
          setAnsCount(ansData.length);
          updateAnsCount(data.length)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


useEffect(()=>{
    const db1 = getDatabase();
    const myRef = ref(db1, "answers");
    onValue(myRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((child) => {
          if (child.val().q_id == qid) {
            data.push({
              ans_id:child.val().ans_id,
              uid: child.val().uid,
              pp: child.val().pp,
              ansBody: child.val().ansBody,
              vote_count: child.val().vote_count,
              date: child.val().date.match(/^\w+\s\w+\s\d+/)[0],
            });
          }
        });
        setAnsData(data);
        setAnsCount(ansData.length);
        updateAnsCount(data.length)
      }
    });
  },[])

 


  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const snapshot = await get(questionRef.current);
        if (snapshot.exists()) {
          setVoteCount(snapshot.val().vote_count);
          setAnsCount(snapshot.val().ans_count);
        }
      } catch (error) {
        console.error("Error fetching vote count:", error);
      }
    };

    fetchVoteCount();
  }, [qid]);
  



  const voteRef = ref(database, "votes/" + qid + uid);
  
  const voteUp = async () => {
     if(isLoggedin){
    try {
      const snapshot2 = await get(voteRef);
      if (snapshot2.exists()) {
        var value = snapshot2.val().value;
        setVoteValue(value);
        setValLoaded(true);          

      } else {
        await set(voteRef, {
          uid: uid,
          q_id: qid,
          vote_id: qid + uid,
          value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
      }

      if(valLoaded){
        const snapshot = await get(questionRef.current);
        if (snapshot.exists()) {
          const votecount = snapshot.val().vote_count;
       
          if (voteValue === 0) {
            setVoteValue(1);
            await update(questionRef.current, { vote_count: votecount + 1 });
            await update(voteRef, { value: 1 });
    
          }else if (voteValue === -1){
            setVoteValue(0);
            await update(questionRef.current, { vote_count: votecount + 1 });
            await update(voteRef, { value: 0 });
          }
        }
    
      }

    } catch (e) {
      console.error("Error fetching vote value:", e);
    }
  }
   
  };

  const voteDown = async () => {
    if(isLoggedin){
    try {
      const snapshot2 = await get(voteRef);
     
      if (snapshot2.exists()) {
        var value = snapshot2.val().value;
        setVoteValue(value);
        setValLoaded(true);          

      } else {
        await set(voteRef, {
          uid: uid,
          q_id: qid,
          vote_id: qid + uid,
          value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
      }

      if(valLoaded){
        const snapshot = await get(questionRef.current);
        if (snapshot.exists()) {
          const votecount = snapshot.val().vote_count;
       
          if (voteValue === 1) {
            setVoteValue(0);
            await update(questionRef.current, { vote_count: votecount - 1 });
            await update(voteRef, { value: 0 });

          }else if (voteValue === 0){
            setVoteValue(-1);
            await update(questionRef.current, { vote_count: votecount - 1 });
            await update(voteRef, { value: -1 });
          }
          
    
    
        }
    
      }

    } catch (e) {
      console.error("Error fetching vote value:", e);
    }
  }
  };

  const qRef = useRef(ref(database, `questions/${qid}`));
  // const aRef = useRef(ref(database, `answers/${qid + uid}`));
  const updateAnsCount = async (anscount) => {
    try {
      const snapshot = await get(qRef.current);
      if (snapshot.exists()) {
        await update(questionRef.current, { ans_count: anscount });
      }
    } catch (e) {
      console.log(e);    }
  };


  function submitAns() {
    if (ansBody === "") {
      alert("Answer must be non-empty");
      return;
    }
    if (!isLoggedin) {
      alert("Login first");
      return;
    }
    if(ScanAbusive(ansBody)){
      alert("Don't use abusive words!");
      return;
    }
    setIsLoading(true);
    setSuccessMessage("");
    // const db = getDatabase();
    const date = new Date().toString();
    const db = getDatabase();
    const child = qid + uid;
    const aRef = ref(db, "answers/" + child);

    set(aRef, {
      uid: uid,
      q_id: qid,
      ans_id: child,
      ansBody: ansBody,
      vote_count: 0,
      date: date,
      tags: "",
      pp: pp,
    })
      .then(() => {
        setSuccessMessage("Answer successfully posted!");
        setIsLoading(false);
        updateAnsCount(ansCount);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }


// useEffect(()=>{
//   const sortedAnswers = ansData.sort((a, b) => {
//     if (sortBy === "datenewest") {
//       return new Date(b.date) - new Date(a.date); // Sort by date
//     } else if (sortBy === "scoredesc") {
//       return b.vote_count - a.vote_count; // Sort by highest score (vote_count)
//     }
//     return 0; // Default to no sorting
//   });
//   setAnsData(sortedAnswers)
// },[sortBy])
  return (
    <div className="container">
  
      {/* view question  */}
{
  isDataLoaded ?
      qData.map((child) => (
        <div class="card m-3">
          <div className="card-header">
            <div className="row">
              <div className="card-title">{child.title}</div>
            </div>
            <div className="row " style={{ fontWeight: "350" }}>
              <div className="col col-lg-3">asked on {child.date}</div>
              <div className="col col-lg-3">
                <span className="badge text-bg-success">
                  {ansData.length} answers
                </span>
              </div>
              <div className="col col-lg-3">{child.views} views</div>
            </div>
          </div>
          <div class="card-body">
            <div className="row">
              <div className="col-3 row col-lg-1 border-end me-1" style={{ height: "200px" }}>
               
                <div className="col-12">
                  <button
                    id="voteup"
                    className="btn btn-outline-primary rounded-circle p-2 lh-1"
                    onClick={voteUp} disabled={voteValue === 1}>
                    <i class="bi bi-caret-up-fill"></i>
                    {/* <i class="bi bi-hand-thumbs-up"></i> */}
                  </button>
                </div>
                <div className="col-12">
                  <h5 className="m-0 ms-2 mt-1 mb-1 mt-lg-2 mb-lg-2">
                    {child.vote_count}
                  </h5>
                </div>
                <div className="col-12">
                  <button
                    id="votedown"
                    className="btn btn-outline-primary rounded-circle p-2 lh-1"
                    onClick={voteDown} disabled={voteValue === -1} >
                    <i className="bi bi-caret-down-fill"></i>
                    {/* <i class="bi bi-hand-thumbs-down"></i> */}
                  </button>
                </div>

        
              </div>
              <div className="col-9 col-lg-10 ">
                {/* <p style={{ fontWeight: "400" }} className="card-text">
                  {child.desc}
                </p> */}
                <div  dangerouslySetInnerHTML={{ __html: MarkdownRender(child.desc) }} /> </div>
            </div>

            {/* <div className="tags">
<Link className="badge text-bg-primary m-1" style={{fontWeight:"200"}}>
    python
</Link>
</div> */}
          </div>
          <div class="card-footer " style={{ fontWeight: "300" }}>
            <div className="row float-end">
              <div className="col">
                <img
                  className="card rounded-circle d-inline"
                  width={"30px"}
                  src={pp}
                  alt=""
                />
                <span className="ms-1 text-primary">{child.duid}</span>
                <span className="ms-1">asked {child.date}</span>
              </div>
            </div>
          </div>
        </div>
      ))
:
//Loading Data
<div class="card m-3 placeholder-glow">
          <div className="card-header">
            <div className="row">
              <div className="card-title placeholder"></div>
            </div>
            <div className="row justify-content-evenly" style={{ fontWeight: "350" }}>
              <div className="col-3 placeholder"></div>
              <div className="col-3 placeholder">
              </div>
              <div className="col-3 placeholder"></div>
            </div>
          </div>
          <div class="card-body">
            <div className="row">
              <div className="col-3  row flex-column  justify-content-evenly " style={{ height: "200px" }}>
                <div className="col-4 p-3 placeholder">
                 
                </div>
                <div className="col-2 p-2 placeholder">
                  
                </div>
                <div className="col-4 p-3 placeholder">
                  
                </div>
              </div>
              <div className="col-9 col-lg-10 ">
               <div className="col-12 placeholder"></div> <br/>
               <div className="col-8 placeholder"></div><br/>
               <div className="col-6 placeholder"></div><br/>
               <div className="col-4 placeholder"></div><br/>
               <div className="col-3 placeholder"></div>
              </div>
            </div>

            {/* <div className="tags">
<Link className="badge text-bg-primary m-1" style={{fontWeight:"200"}}>
    python
</Link>
</div> */}
          </div>
          <div class="card-footer " style={{ fontWeight: "300" }}>
            <div className="row justify-content-end gap-3">
              <div className="col-3 placeholder">
              </div>
              <div className="col-3 placeholder">
              </div>
            </div>
          </div>
        </div>

}
      {/* view question end */}

      {/* answers  */}
      <div className="container-fluid mt-5">
        {/* ans_top_header */}
        <div className="row justify-content-between">
          <div className="col col-lg-4">
            <h5>{ansData.length} Answers</h5>
          </div>
          {/* <div className="col col-lg-4 " style={{ fontWeight: "400" }}>
            sorted by:
            <select
              class="form-select form-select-sm"
              aria-label="Small select example" value={sortBy} 
              onChange={(event) => {
    setSortBy(event.target.value);
  }}
              >
              <option value="scoredesc" selected="selected">
                Highest score (default)
              </option>
              <option value="datenewest">Date modified (newest first)</option>
              <option value="dateoldest">Date created (oldest first)</option>
            </select>
          </div> */}
        </div>
        {/* ans_top_header end */}

        {/* answers-list */}

        {ansData.map((child) => (
          <AnswerList
            ansBody={child.ansBody}
            vote_count={child.vote_count}
            username={child.uid.slice(0, 8)}
            posted_on={child.date}
            pp={child.pp}
            ans_id={child.ans_id}

          />
        ))}
        {/* answers-list end*/}

        <PostAnswer
          isLoading={isLoading}
          successMessage={successMessage}
          ansBody={ansBody}
          onChange={(event) => {
            setAnsBody(event.target.value);
          }}
          onClick={submitAns}
        />
      </div>

      {/* {isLoggedin&&
        voteLoaded ? <Spinner display='d-none'/> : <Spinner display='d-block'/> } */}
    </div>
  );
}


function PostAnswer(props) {
  const [isAbusive,setIsAbusive]=useState()
  useEffect(()=>{

    setIsAbusive(ScanAbusive(props.ansBody))
    console.log(isAbusive)
  
    }, [props.ansBody])

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-12 ">
          <h3>Your Answer</h3>
          {/* <form action={this}> */}

          <div className="form-container mt-2 mb-2 card p-3">
            <label
              htmlFor="ansBody"
              className="ms-1 mb-2"
              style={{ fontSize: "12px", fontWeight: "400" }}>
              <h6 className="m-0">Answer Body</h6>
              Reminder: Answers generated by artificial intelligence tools are
              not allowed
            </label>
            <textarea
              class={`form-control form-control-sm ${isAbusive ? "is-invalid": props.ansBody.length>20? "is-valid":""}`}
              id="ansBody"
              rows="6"
              value={props.ansBody}
              onChange={props.onChange}
              required></textarea>
               { props.ansBody&&
              <div className={`${isAbusive ? "invalid-feedback":"valid-feedback"}`} style={{fontWeight:"350"}}>
                {isAbusive ? "Answer contains abusive Language!": "Ready to post Answer"}
              </div>}
          </div>

          <div
            class="alert alert-warning alert-dismissible fade show mt-3 mb-3"
            style={{ fontSize: "12px", fontWeight: "400" }}
            role="alert">
            <div class="">
              <p>Thanks for contributing an answer to Anonymo!</p>
              <ul>
                <li>
                  Please be sure to <em>answer the question</em>. Provide
                  details and share your research!
                </li>
              </ul>
              <p>
                But <em>avoid</em> …
              </p>
              <ul>
                <li>
                  Asking for help, clarification, or responding to other
                  answers.
                </li>
                <li>
                  Making statements based on opinion; back them up with
                  references or personal experience.
                </li>
              </ul>
              <p>
                To learn more, see our{" "}
                <Link to="/help/how-to-answer">
                  tips on writing great answers
                </Link>
                .
              </p>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"></button>
          </div>

          <button
            type="submit"
            className="btn btn-dark mt-3 "
            {...props}
            // data-bs-toggle="modal"
            // data-bs-target="#spinner"
            disabled={props.isLoading}>
            {props.isLoading ? "Posting Answer..." : "POST YOUR ANSWER"}
          </button>
          {props.successMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {props.successMessage}
            </div>
          )}

          {
            !props.isLoading? <Spinner display='d-none'/> : <Spinner display='d-block'/> }
          {/* </form> */}
        </div>
      </div>
      
    </div>
  );
}
export default ViewQuestion;
