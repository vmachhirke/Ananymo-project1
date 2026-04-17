import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import MarkdownRender from "./MarkdownRender";

import {
  getDatabase,
  ref,
  get,
  child,
  update,
  onValue,
  set,
  push,
  orderByChild,
  equalTo,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "./Spinner";

function AnswerList(props) {
  const auth = getAuth();
  const [isLoggedin, setisLoggedin] = useState(false);
  const [uid, setUID] = useState();
  const [voteValue, setVoteValue] = useState(0);
  const [isDataLoaded,setDataLoaded]=useState(false);
  const [valLoaded,setValLoaded]=useState(false)
  const [voteLoaded,setVoteLoaded]=useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUID(user.uid);
        setisLoggedin(true);
      } else {
        setisLoggedin(false);
      }
    });
  }, [isLoggedin]);


  const dbvote = getDatabase();
useEffect(() => {
   
if(isLoggedin){
    onValue(ref(dbvote, "votes/" + props.ans_id + uid) , (ss) => {
      if (ss.exists()) {
        var value = ss.val().value;
        setVoteValue(value); 
        console.log(value);
        setVoteLoaded(true);

      }else {
     set( ref(dbans, "votes/" + props.ans_id + uid), {
      uid: uid,
      ans_id: props.ans_id,
      vote_id: props.ans_id + uid,
      value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
        setVoteLoaded(true);
      }

    });
  }

  }, [isLoggedin]);

  const dbans = getDatabase();
  const ansRef = useRef(ref(dbans, `answers/${props.ans_id}`)); 

  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const snapshot = await get(ansRef.current);
        if (snapshot.exists()) {
          setVoteCount(snapshot.val().vote_count);
       
        }
      } catch (error) {
        console.error("Error fetching vote count:", error);
      }
    };

    fetchVoteCount();
  }, [props.ans_id]);

 

  
  const voteUp = async () => {
  //  console.log("voteUp called")
  if(isLoggedin){

    const voteRef = ref(dbans, "votes/" + props.ans_id + uid);

    try {
      const snapshot2 = await get(voteRef);
     
      if (snapshot2.exists()) {
        var value = snapshot2.val().value;
        setVoteValue(value);
        setValLoaded(true);          

      } else {
        await set(voteRef, {
          uid: uid,
          ans_id: props.ans_id,
          vote_id: props.ans_id + uid,
          value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
      }

      if(valLoaded){
        const snapshot = await get(ansRef.current);
        if (snapshot.exists()) {
          const votecount = snapshot.val().vote_count;
       
          if (voteValue === 0) {
            setVoteValue(1);
            await update(ansRef.current, { vote_count: votecount + 1 });
            await update(voteRef, { value: 1 });
    
          }else if (voteValue === -1){
            setVoteValue(0);
            await update(ansRef.current, { vote_count: votecount + 1 });
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
    const voteRef = ref(dbans, "votes/" + props.ans_id + uid);
    try {
      const snapshot2 = await get(voteRef);
     
      if (snapshot2.exists()) {
        var value = snapshot2.val().value;
        setVoteValue(value);
        setValLoaded(true);        
        console.log("value loaded"+value)  

      } else {
        await set(voteRef, {
          uid: uid,
          ans_id: props.ans_id,
          vote_id: props.ans_id + uid,
          value: 0,
        });
        setVoteValue(0);
        setValLoaded(true);
      }

      if(valLoaded){
        const snapshot = await get(ansRef.current);
        if (snapshot.exists()) {
          const votecount = snapshot.val().vote_count;
       
          if (voteValue === 1) {
            setVoteValue(0);
            await update(ansRef.current, { vote_count: votecount - 1 });
            await update(voteRef, { value: 0 });

          }else if (voteValue === 0){
            setVoteValue(-1);
            await update(ansRef.current, { vote_count: votecount - 1 });
            await update(voteRef, { value: -1 });
          }
          
    
    
        }
    
      }

    } catch (e) {
      console.error("Error fetching vote value:", e);
    }
  }
  };


    return (
      
      <div class="card m-3">
        <div class="card-body">
          <div className="row">
            <div className="col-3  row col-lg-1 border-end me-1" style={{ height: "200px" }}>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary rounded-circle p-2 lh-1"  onClick={voteUp} disabled={voteValue === 1}
                 >
                  <i class="bi bi-caret-up-fill"></i>
                </button>
              </div>
              <div className="col-12">
                <h5 className="m-0 ms-2 mt-1 mb-1 mt-lg-2 mb-lg-2">
                  {props.vote_count}
                </h5>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary rounded-circle p-2 lh-1" onClick={voteDown} disabled={voteValue === -1}
                  >
                  <i class="bi bi-caret-down-fill"></i>
                </button>
              </div>
            </div>
            <div className="col-9 col-lg-10 ">
              <>
              <div  dangerouslySetInnerHTML={{ __html: MarkdownRender(props.ansBody) }} /> 
              </>
              
             
            </div>
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
                src={props.pp}
                alt=""
              />
              <span className="ms-1 text-primary">{props.username}</span>
              <span className="ms-1">answered on {props.posted_on}</span>
            </div>
          </div>
        </div>

      </div>


    );
  }


  

function AnswerListLoading() {
  return (
   //Loading Data
<div class="card m-3 placeholder-glow">
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
  );
}

  

  export  {AnswerList,AnswerListLoading};