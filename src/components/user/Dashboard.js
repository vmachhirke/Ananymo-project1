import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";

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

function Dashboard() {
  const [isLoggedin, setisLoggedin] = useState(null);
  const auth = getAuth();
  const [name, setName] = useState("name...");
  const [profpic, setPic] = useState("");
  const [username, setUsername] = useState("");
  const [newUsername, setnewUsername] = useState("");
  const [myAnswers, setmyAnswers] = useState([]);
  const [myQuestions, setmyQuestions] = useState([]);
  const [votesQData, setVotesQData] = useState([]);
  const [votesAData, setVotesAData] = useState([]);

  const [ansCount, setAnsCount] = useState(0);
  const [queCount, setQueCount] = useState(0);
  const [votesCount, setVoteCount] = useState(0);
  const [ansQueMerge, setAQMerge] = useState([]);
  const [ansQueVoteQMerge, setAQVQMerge] = useState([]);
  const [ansQueVoteAMerge, setAQVAMerge] = useState([]);

  const [votesGainedQ,setVotesGainedQ]=useState(0);
  const [votesGainedA,setVotesGainedA]=useState(0);



  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setisLoggedin(user);
        setName(user.displayName);
        setPic(user.photoURL);
        setUsername(uid);
        setnewUsername(uid);
      } else {
        navigate("/login");
        setisLoggedin(null);
      }
    });
  });
  const SignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logout ");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

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
          var votesGained=0;
          snapshot.forEach((child) => {
            if (child.val().uid === username) {
              data.push({
                ans_id: child.val().ans_id,
                uid: child.val().uid,
                pp: child.val().pp,
                ansBody: child.val().ansBody,
                vote_count: child.val().vote_count,
                q_id: child.val().q_id,
                date: child.val().date.match(/^\w+\s\w+\s\d+/)[0],
              });
              votesGained+=Number(child.val().vote_count)
            }
          });
          setmyAnswers(data);
          setAnsCount(myAnswers.length);
          setVotesGainedA(votesGained);
          console.log(votesGained)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [username]);

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "questions");

    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = [];
          var votesGained=0;

          snapshot.forEach((child) => {
            if (child.val().uid === username) {
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
              votesGained+=Number(child.val().vote_count)
            }
          });

          setmyQuestions(data);
          setVotesGainedQ(votesGained);
          console.log(votesGained)
          // setDataLoaded(true)
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [username]);

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "votes");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dataQ = [];
          const dataA = [];
          snapshot.forEach((child) => {
            if (child.val().uid === username) {
              const hasAnsId =
                child.val().ans_id !== undefined && child.val().ans_id !== null;
              if (hasAnsId) {
                dataA.push({
                  ans_id: child.val().ans_id,
                  uid: child.val().uid,
                  vote_id: child.val().vote_id,
                  value: child.val().value,
                });
              } else {
                dataQ.push({
                  q_id: child.val().q_id,
                  uid: child.val().uid,
                  vote_id: child.val().vote_id,
                  value: child.val().value,
                });
              }
            }
          });
          setVotesQData(dataQ);
          setVotesAData(dataA);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [username]);

  useEffect(() => {
    const combinedData = myAnswers.map((answer) => {
      const question = myQuestions.find(
        (question) => question.q_id === answer.q_id
      );
      return { ...answer, ...question };
    });

    setAQMerge(combinedData);
  }, [myQuestions, myAnswers]);

  useEffect(() => {
    const combinedData = ansQueMerge.map((aq) => {
      const voteq = votesQData.find((voteq) => voteq.q_id === aq.q_id);
      return { ...aq, ...voteq };
    });

    setAQVQMerge(combinedData);
  }, [ansQueMerge, votesQData]);

  useEffect(() => {
    const combinedData = ansQueMerge.map((aq) => {
      const votea = votesAData.find((votea) => votea.ans_id === aq.ans_id);
      return { ...aq, ...votea };
    });

    setAQVAMerge(combinedData);
  }, [ansQueMerge, votesQData]);

  return (
    <>
      <div className="container p-4 p-lg-5">
        <div className="row justify-content-center gap-2 ">
          <div className="col-12 col-lg-5 card p-1 p-lg-2">
            <div className="d-flex justify-content-end">
              {/* <button className="btn btn-sm btn-primary ">Edit</button> */}
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center">
              <img
                className="rounded-circle mb-2"
                width={"100px"}
                src={profpic}
                alt=""
              />
              <h4>{name}</h4>
              <div className="input-group input-group-sm flex-nowrap w-50">
                <span className="input-group-text" id="addon-wrapping">
                  @
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  value={username}
                />
                <button
                  className="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#editUsernameModal">
                  <i className="bi bi-pencil-fill"></i>
                </button>
              </div>
            </div>
            <div className="container-fluid mt-4">
              <div className="row justify-content-center gap-1 gap-lg-2">
                <div className="col-4 col-lg-3  card align-items-center bg-primary text-light">
                  <h2 className="m-0">
                    {myAnswers.length}
                    {/*<sup><i className="bi bi-info-circle" style={{fontSize:"14px"}}  ></i></sup>*/}{" "}
                  </h2>
                  <p style={{ fontWeight: "350" }} className="">
                    Answers
                  </p>
                </div>
                <div className="col-3 col-lg-3 card align-items-center bg-success text-light">
                  <h2 className="m-0">{myQuestions.length}</h2>
                  <p style={{ fontWeight: "350" }} className="">
                    Questions
                  </p>
                </div>
                <div className="col-4 col-lg-3 card align-items-center bg-warning text-light">
                  <h2 className="m-0">
                    {votesAData.length + votesQData.length}
                  </h2>
                  <p style={{ fontWeight: "350" }} className="">
                    Votes cast
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-sm btn-danger mt-5 w-25"
                onClick={SignOut}>
                Logout
              </button>
            </div>
          </div>
        
            <BadgeComponent no_of_questions_answered={Number(myAnswers.length)} votes_gained={Number(votesGainedA)} no_of_questions_asked={Number(myQuestions.lenght)} votes_gained_for_questions={Number(votesGainedQ)}   />
      



        </div>
      </div>

      <div className="container ">
        <div className="row p-2 card mb-2">
          <div>
            <p>Questions list:</p>
            {myQuestions.map((child) => (
              <QueList
                q_title={child.title}
                votes={child.vote_count}
                view_count={child.views}
                q_id={child.q_id}
                posted_on={child.date}
                ans_count={child.ans_count}
              />
            ))}
          </div>
        </div>
        <div className="row p-2 card mb-2">
          <div>
            <p>Answers list:</p>
            {ansQueMerge.map((child) => (
              <AnsList
                ans_title={child.ansBody}
                votes={child.vote_count}
                q_id={child.q_id}
                posted_on={child.date}
                q_title={child.title}
              />
            ))}
          </div>
        </div>
        <div className="row p-2 card mb-5">
          <div>
            <p>votes:</p>
            <ul>
              <li>Questions votes</li>
            </ul>

            <ul className="list-group ms-5 ">
              {ansQueVoteQMerge.map((child) => (
                <li className="list-group-item w-75 mb-3 d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className=" fw-light">{child.title}</div>
                  </div>
                  <span className="badge text-bg-primary rounded-pill">
                    {child.value}
                  </span>
                </li>
              ))}
            </ul>

            <ul>
              <li>Answers votes</li>
            </ul>

            <ul className="list-group ms-5 ">
              {ansQueVoteAMerge.map((child) => (
                <li className="list-group-item w-75 mb-3 d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className=" fw-light">question: {child.title} </div>
                    <div className=" fw-light">answer: {child.ansBody} </div>
                  </div>
                  <span className="badge text-bg-primary rounded-pill">
                    {child.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* modal change username */}
      <div
        className="modal fade"
        id="editUsernameModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Username
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="addon-wrapping"
                    id="editUsername"
                    value={newUsername}
                    onChange={(event) => {
                      setnewUsername(event.target.value);
                    }}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className=" rounded-circle bg-primary text-center  position-fixed top-50 end-0" style={{width:"40px",height:"40px",}}><i className="bi bi-arrow-down-circle text-light " style={{fontSize:"28px"}}></i></div> */}
      {username ? <Spinner display="d-none" /> : <Spinner display="d-block" />}
    </>
  );
}

function QueList(props) {
  return (
    <div className="card m-3">
      <div className="card-header">
        <div className="row">
          <div className="col col-lg-3">{props.votes} votes</div>
          <div className="col col-lg-3">
            <span className="badge text-bg-success">
              {props.ans_count} answers
            </span>
          </div>
          <div className="col col-lg-3">{props.view_count} views</div>
        </div>
      </div>
      <div className="card-body">
        <Link
          to={`/questions/view?qid=${props.q_id}`}
          state={{ scrollToTop: true }}
          className="text-decoration-none ">
          {props.q_title}
        </Link>
      </div>
      <div className="card-footer " style={{ fontWeight: "300" }}>
        <div className="row float-end">
          <div className="col">
            <span className="ms-1">asked on {props.posted_on}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnsList(props) {
  return (
    <div className="card m-3">
      <div className="card-header">
        <div className="row">
          <div className="col col-lg-3">{props.votes} votes</div>
        </div>
      </div>
      <div className="card-body">
        <Link
          to={`/questions/view?qid=${props.q_id}`}
          state={{ scrollToTop: true }}
          className="text-decoration-none ">
          Question: {props.q_title}
        </Link>
        <ul>
          <li>answer: {props.ans_title}</li>
        </ul>
      </div>
      <div className="card-footer " style={{ fontWeight: "300" }}>
        <div className="row float-end">
          <div className="col">
            <span className="ms-1">answered on {props.posted_on}</span>
          </div>
        </div>
      </div>
    </div>
  );
}



const BadgeComponent = (props) => {
    const [badges, setBadges] = useState([]);
    const [totalPoint,setTotalPoints]=useState(0)

   useEffect(()=>{
           var totalPoints =((props.no_of_questions_answered) * 1) +
                                ((props.votes_gained )* 2) +
                               ( (props.no_of_questions_asked )* 1) +
                                ((props.votes_gained_for_questions) * 3);

            let badge = 'No Badge';

        setTotalPoints(10)
        


   },[props.no_of_questions_answered]);

            // if (totalPoints >= 1000) {
            //     badge = 'Gold Badge';
            // } else if (totalPoints >= 500) {
            //     badge = 'Silver Badge';
            // } else if (totalPoints >= 100) {
            //     badge = 'Bronze Badge';
            // }

        // setBadges(badge);

    return (
        <div className="col-12 col-lg-3 card text-center">
           <h4 className="mt-5">Total Points</h4>
            <p>{totalPoint}</p>
            <lottie-player
              src="https://lottie.host/83058c04-2752-4e2c-a2b8-a3f78d215498/QK3klvQLzQ.json"
              background="#FFFFFF"
              speed="1"
              loop
              autoplay
              direction="1"
              mode="normal"></lottie-player>
{/*
<lottie-player
            src="https://lottie.host/9aefeacf-0122-47c6-911b-2c4feb95b62d/5ZNsGfJvwJ.json"
            background="transparent"
            speed="1"
            // style="width: 300px; height: 300px;"
            loop
            autoplay></lottie-player>

<lottie-player
            src="https://lottie.host/cb39446a-a697-4813-bfc0-5d26d85a75c7/Amvenr37PF.json"
            background="transparent"
            speed="1"
            // style="width: 300px; height: 300px;"
            loop
            autoplay></lottie-player>

<lottie-player
            src="https://lottie.host/af6296fa-bc88-433b-9c98-9eeaf09602af/JWGTEkL2Yu.json"
            background="transparent"
            speed="1"
            // style="width: 300px; height: 300px;"
            loop
            autoplay></lottie-player> */}
        </div>
    );
};



export default Dashboard;



