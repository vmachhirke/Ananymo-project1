import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDatabase,ref, get, } from 'firebase/database';
import Spinner from "../Spinner";

function AdminHome() {
  const [isLoggedin, setisLoggedin] = useState(null);
  const auth = getAuth();
  const [name, setName] = useState("name...");
  const [profpic, setPic] = useState("");
  const [username, setUsername] = useState("");
  const [newUsername, setnewUsername] = useState("");
  const [userData,setUserdata]=useState([]);

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
        console.log("Signed out ");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };



  {/* users data */}

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
              name:child.val().name,
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


  return (
    <>
      <div className="container p-3 p-lg-3">
        <div className="row m-3 text-center">
          <p className="p-0 m-2">Admin Panel:</p>
        </div>
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
              <div class="input-group input-group-sm flex-nowrap w-50">
                <span class="input-group-text" id="addon-wrapping">
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
                  <i class="bi bi-pencil-fill"></i>
                </button>
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
        </div>
      </div>


      <div className="container mb-3">
        <div className="row card p-2 ">
        <div class="row row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center">
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">Manage users</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled mt-3 mb-4">
              <li>All users list</li>
              
            </ul>
           <Link  to='/admin'> <button type="button" class="w-100 btn btn-lg btn-primary">Manage Users</button></Link>
          </div>
        </div>
      </div>


      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">Manage Quiz</h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled mt-3 mb-4">
              <li>Quiz</li>
              
            </ul>
            <Link  to='/admin/managequiz'> <button type="button" class="w-100 btn btn-lg btn-primary">Manage Quiz</button></Link>
          </div>
        </div>
      </div>

     
    </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row card p-3 ">
          <p>All Users:</p>

{
  userData.map((child)=>(
    <div className="col-8 border border-danger rounded-1 bg-danger-subtle p-2 m-1">
            <div className="row">
              <div className="col-10">
                <div className="row">
                  <div className="col-2">
                    <img src={child.pp} className="rounded-pill" alt="" width={'50px'} height={'50px'} />
                  </div>
                  <div className="col-4">
                  <p>{child.name}</p>
                  </div>
                </div>
                
              </div>
              
              <div className="col-2">
                <button className="btn btn-danger btn-sm">Delete user</button>
              </div>
            </div>
            <div className="row p-0 m-0">
              <p className="float-end m-0 p-0" style={{ fontWeight: "200" }}>
                uid: {child.uid}
              </p>
            </div>
          </div>
  ))
}
          
        </div>
      </div>


      

      <div
        class="modal fade"
        id="editUsernameModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Edit Username
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="input-group flex-nowrap">
                  <span class="input-group-text" id="addon-wrapping">
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
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {username ? <Spinner display="d-none" /> : <Spinner display="d-block" />}
    </>
  );
}

export default AdminHome;
