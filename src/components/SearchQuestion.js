import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QueBlock, QueBlockLoading } from "./QueBlock";
import { getDatabase, ref, get } from "firebase/database";

function SearchQuestion() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qquery = queryParams.get("q");
  const [Qquery, setQquery] = useState("");
  const [qLength,setQlength]=useState(0)

  useEffect(()=>{
  if(qquery){
  setQquery(qquery);
}
},[qquery])

  const [questions, setQue] = useState([]);
  const [userData, setUserdata] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [qresultcount, setResultcount] = useState(0);

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "users");

    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = [];
          snapshot.forEach((child) => {
            data.push({
              key: child.key,
              uid: child.val().uid,
              pp: child.val().pp,
            });
          });
          setUserdata(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "questions");

    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = [];
          snapshot.forEach((child) => {
           
            data.push({
              key: child.key,
              uid: child.val().uid,
              duid:(child.val().uid).slice(0,8),
              q_id: child.val().q_id,
              title: child.val().title,
              desc: child.val().desc,
              ans_count: child.val().ans_count,
              vote_count: child.val().vote_count,
              date: child.val().date.match(/^\w+\s\w+\s\d+/)[0],
              tags: "",
              views: child.val().views,
            });
          });
          setQue(data);
          setDataLoaded(true);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setCombinedData(
      questions.map((questions) => ({
        ...questions,
        pp: userData.find((user) => user.uid === questions.uid)?.pp, // Find matching user and add pp
      }))
    );
  }, [questions, userData]);

//   document.getElementById('qinput').value=Qquery;

const filteredQuestions = combinedData.filter((question) => {
  if(Qquery.length>0){
  return question.title.toLowerCase().includes(Qquery.toLowerCase());
}
});

useEffect(()=>{
  setQlength(filteredQuestions.length)  
  },[filteredQuestions])
  return (
    <div className="container p-2 p-lg-5">
      <div className="row justify-content-center">
        <form
          className="d-flex input-group w-auto mt-2  me-lg-5 mb-3 mb-lg-0 p-2 rounded-4 shadow  bg-light"
          role="search">
          <input
            type="text"
            id="qinput"
            class="form-control border-0"
            style={{ height: "70px", fontSize: "22px" }}
            placeholder="what is your question?"
            aria-label="search"
            value={Qquery}
            onChange={(e) => {
              setQquery(e.target.value);
            }}
            required

            onKeyDown={
              (event)=> {
  if (event.keyCode === 13) {
    event.preventDefault();
  }
}
            }
          />
          <Link to={`/search-question?q=${Qquery}`}>
            <button
              class="btn btn-outline-dark rounded-4 "
              style={{ width: "70px", height: "70px" }}
              type="button"
              id="button-addon2">
              <i class="bi bi-search"></i>
            </button>
          </Link>
        </form>
      </div>

      {/*Questions List */}
      
      <div className="row">
        <div className="col-6">
          <h4>All Results {qLength}</h4>
        </div>
        {/* <div className="col-6">
          <Link
            to={"/ask-question"}
            className="btn btn-sm btn-primary float-end">
            Ask Question
          </Link>
        </div> */}

{ isDataLoaded? 

Qquery&&filteredQuestions.map((child) => (
    <QueBlock votes={child.vote_count} ans_count={child.ans_count} view_count={child.views} q_title={child.title} q_desc={(child.desc).slice(0,350)} img={child.pp} username={child.duid} posted_on={child.date} q_id={child.q_id} />
))
:
<>
<QueBlockLoading/>
<QueBlockLoading/>
<QueBlockLoading/>
</>

}
      </div>
{ qLength<=0&&
            <QueNotFound/>
}

    </div>
  );
}

function QueNotFound() {
  return (
    <div className="row justify-content-center">
    <div className="d-flex row justify-content-center">
      <lottie-player
        src="https://lottie.host/a7de03d3-d9ed-4bfd-b729-b3057d3b473b/PMqrk1Tvey.json"
        background="##FFFFFF"
        speed="1"
        style={{width: "300px", height: "300px"}}
        loop
        autoplay
        direction="1"
        mode="normal"></lottie-player>

        </div>
        <div className="text-center">
        <p>Question Not Found!</p>
        <Link
            to={"/ask-question"}
            className="btn btn-sm btn-primary">
            Ask Question
          </Link>
        </div>
    </div>
  );
}
export default SearchQuestion;
