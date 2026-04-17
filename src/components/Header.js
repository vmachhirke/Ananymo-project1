import {Link} from 'react-router-dom'
import logo from '../assets/img/logo.png'
import logo2 from '../assets/img/hacker.svg'
import '../assets/styles/Header.css'
import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth,signOut } from 'firebase/auth';
import { getDatabase,ref,get, } from 'firebase/database';

function Header(props){


  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [pp,setPP]=useState();
  const [uid,setUID]=useState();
  const [searchQuery,setSearchQuery]=useState('');
  const [questions,setQue]=useState([]);
  const [isDataLoaded,setDataLoaded]=useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        setUser(user);
      
        setPP(user.photoURL)

      } else {
        // No user is logged in
        setUser(null);
      }
    });
  }, [auth]);

  const SignOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        console.log("Signed out ");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

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
              duid:(child.val().uid).slice(0,6),
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
          setDataLoaded(true);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  const filteredQuestions = questions.filter((question) => {
    if(searchQuery.length>0){
    return question.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return(

    <nav className="shadow-sm navbar bg-body-tertiary navbar-expand-lg " style={{boxShadow:"1px 1px black"}}>
  <div className="container-fluid justify-content-start">

  <button className="navbar-toggler  text-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
  <h3 className="logo ms-3 ms-lg-5 ms-md-5">
<span style={{color:"#4285f4"}}>A</span>
<span style={{color:"#ea4335"}}>N</span>
<span style={{color:"#fbbc05"}}>O</span>
<span style={{color:"#ea4335"}}>N</span>
<span style={{color:"	#34a853"}}>Y</span>
<span style={{color:"#673ab7"}}>M</span>
<span style={{color:"#fbbc05"}}>O</span>
</h3>

{
              user ? (
                <>
                {/* <i className="bi bi-person-circle"></i> */}
                  
                  {/* <button  className='btn btn-light rounded-circle m-0 p-0' style={{width:"42px", height:"42px"}}>
                  <img width={"38px"}  className='rounded-circle' src="https://lh3.googleusercontent.com/a/ACg8ocKuduhyDnHPrBhrzuCn6rXpCBECYFWmnxVIK0GQLwwQdiY=s96-c" alt="" />
                  </button> */}

                 
<div style={{width:"40%"}} className=' d-lg-none'>
<div className="dropdown text-end text-end ">
          <Link to="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={pp} alt="pp" width="32" height="32" className="rounded-circle"/>
          </Link>
         
          <ul className="dropdown-menu text-small">
          <li><Link className="dropdown-item" to="/ask-question">Ask question...</Link></li>
          <li><Link className="dropdown-item" to="/quiz">Quiz</Link></li>
            <li><Link className="dropdown-item" to="/search-question">Search question</Link></li>
            <li><Link className="dropdown-item" to="/user-dashboard">Profile</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><button className="dropdown-item btn btn-sm btn-danger" onClick={SignOut} >Sign out</button></li>
          </ul>
        </div>
</div>
                </>
              ):
              <div style={{width:"40%"}} className='d-lg-none'>
                <Link to={'/login'} className='btn btn-sm btn-outline-success float-end'>Log in</Link>
              </div>
            }
    
    <div className="offcanvas offcanvas-start w-75" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div className="offcanvas-header">
        {/* <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5> */}
        <button type="button" className="btn-close text-end" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" >
      <li className="nav-item">
                <Link className="nav-link  ms-lg-2 " aria-current="page" to="/">Home{/*<i className="bi bi-house-fill "></i>*/}</Link>
              </li> 
              <li className="nav-item">
                <Link className="nav-link ms-lg-2 " aria-current="page" to="/about">About</Link>
              </li>                     
              
            </ul>
            <Link to={'/quiz/view'} className={`btn  btn-outline-dark me-lg-2 mb-1 mb-lg-0 d-block mt-5 mt-lg-0`}>Start Quiz</Link>
           <Link to={'/ask-question'} className={`btn  btn-outline-dark me-lg-2 mb-1 mb-lg-0 d-block mt-2 mt-lg-0 ${props.searchQ&&"me-lg-5"}`}>Ask Question</Link>
           { !props.searchQ&&

           <div className="dropdown-center">
            <form className="d-flex input-group w-auto  me-lg-5 mb-3 mb-lg-0" data-bs-toggle="dropdown" aria-expanded="false" role="search">
                <input type="text" className="form-control "  placeholder="search question" aria-label="search" value={searchQuery}  onChange={(e)=>{setSearchQuery(e.target.value)}} />
                {/* <Link to={`/search-question?q=${searchQuery}`} className="btn btn-outline-dark" type="button" id="button-addon2"><i className="bi bi-search"></i></Link> */}
            </form>
         <ul class="dropdown-menu w-100">
{ isDataLoaded?searchQuery&&filteredQuestions.map((child)=>
    <li><Link class="dropdown-item" to={`/questions/view?qid=${child.q_id}`}>{child.title}</Link></li>
    )
    : <div className="placeholder-glow text-center">
      <div className="col-8 placeholder"></div>
      <div className="col-8 placeholder"></div>
    </div>
}
{
  !searchQuery&&<li className='text-center' style={{fontWeight:"200"}}>Enter question to search!</li>
}
  </ul>
            </div>
           }
            {
              user ? (
                <>
                {/* <i className="bi bi-person-circle"></i> */}
                  
                  {/* <button  className='btn btn-light rounded-circle m-0 p-0' style={{width:"42px", height:"42px"}}>
                  <img width={"38px"}  className='rounded-circle' src="https://lh3.googleusercontent.com/a/ACg8ocKuduhyDnHPrBhrzuCn6rXpCBECYFWmnxVIK0GQLwwQdiY=s96-c" alt="" />
                  </button> */}

                 

<div className="dropdown text-end text-end d-none d-lg-block">
          <Link to="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={pp} alt="pp" width="32" height="32" className="rounded-circle"/>
          </Link>
          <ul className="dropdown-menu text-small">
          <li><Link className="dropdown-item" to="/ask-question">Ask question...</Link></li>
          <li><Link className="dropdown-item" to="/quiz">Quiz</Link></li>
            <li><Link className="dropdown-item" to="/search-question">Search question</Link></li>
            <li><Link className="dropdown-item" to="/user-dashboard">Profile</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><button className="dropdown-item btn btn-sm btn-danger" onClick={SignOut} >Sign out</button></li>
          </ul>
        </div>
                </>
              ):
              
                <Link to={'/login'} className='btn  btn-outline-success d-none d-lg-block me-lg-2 mb-1 mb-lg-0 d-block mt-5 mt-lg-0 '>Log in</Link>
              
            }
        
        
        {/* <Link to={'/signup'} className='btn  btn-success me-lg-2  d-block'>Sign up</Link> */}

        
      </div>
    </div>
  </div>
</nav>
  )
}




export default Header;