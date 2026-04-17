import {QueBlock,QueBlockLoading} from './QueBlock';
import { Link } from 'react-router-dom';
import { getDatabase,ref, get, } from 'firebase/database';
import { useState,useEffect } from 'react';

function AllQuestion(){

const [questions,setQue]=useState([]);
const [userData,setUserdata]=useState([]);
const [combinedData,setCombinedData]=useState([])
const [isDataLoaded,setDataLoaded]=useState(false);

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
              date: (child.val().date).match(/^\w+\s\w+\s\d+/)[0],
              tags: "",
              views: child.val().views, 

            });
          });
          setQue(data);
          setDataLoaded(true)
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
  
    return(
        <div className="container pt-5 pb-5" >
<div className="row">
    <div className="col-6">
    <h4>All Questions</h4>
    </div>
    <div className="col-6">
        <Link to={"/ask-question"} className='btn btn-sm btn-primary float-end'>Ask Question</Link>
    </div>
</div>

{ isDataLoaded? 
combinedData.slice(0, 10).map((child) => (

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
    )
}
export default AllQuestion;