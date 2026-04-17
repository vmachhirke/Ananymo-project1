// import logo from './logo.svg';
import './assets/styles/App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import AskQuestion from './components/AskQuestion';
import app from "./init/firebase-init";
import Dashboard from './components/user/Dashboard'
import {QueBlock,QueBlockLoading} from './components/QueBlock';
import ViewQuestion from './components/ViewQuestion';
import AllQuestion from './components/AllQuestion';
import AdminHome from './components/admin/AdminHome';
import ScrollTop from './components/ScrollTop';
import Test from './components/Test';
import SearchQuestion from './components/SearchQuestion';
import ScanAbusive  from './components/ScanAbusive';
// import Quiz from './components/quiz/components/Home'
// import Game from './components/quiz/QuizHome'
import QuizHome from './components/quiz/QuizHome';
import Quiz from './components/quiz/Quiz';

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

const router=createBrowserRouter([

  {
    path:'/',
    element: (
      <>
        <Header/>
        <Home/>
        <Footer/>
      </>
    )
  },
  {
    path:'/login',
    element: (
      <>
        <Header/>
        <Login/>
        <Footer/>
      </>
    )
  },
  // {
  //   path:'/signup',
  //   element: (
  //     <>
  //       <Header/>
  //       <Signup/>
  //       <Footer/>
  //     </>
  //   )
  // },
  {
    path:'/ask-question',
    element: (
      <>
        <Header/>
        <AskQuestion/>
        <Footer/>
      </>
    )
  },
  {
    path: '/about',
    element: (
      <>
        <Header/>
        <About/>
        <Footer/>
      </>
    )
  },
  {
    path: '/user-dashboard',
    element: (
      <>
        <Header/>
        <Dashboard/>
        <Footer/>
      </>
    )
  },
  {
    path:'/search-question',
    element: <>
     <Header searchQ={true}/>
        <SearchQuestion/>
        <Footer/>
    </>
  },
  {
    path:'/questions',
    element: <>
    <Header/>
       <AllQuestion/>
       <Footer/>
    </>
  },
  {
    path:'/questions/view',
    element: <>
    <Header/>

        <ViewQuestion/>
        <Footer/>
    </>
  },
  {
    path:'/admin',
    element: <>
    <Header/>

       <AdminHome/>
        <Footer/>
    </>
  },
  {
    path:'/test',
    element: <>
   <Test/>
    </>
  },
  {
    path:'/scanabusive',
    element: <ScanAbusive/>
  },
  {
    path:'/quiz',
  
    element:
    <>
    <Header/>
    <QuizHome/>
    <Footer/>
</>

  },
  {
    path:'/quiz/view',
    element:  
    <>
    <Header/>
    <Quiz/>
    <Footer/>
</>
  }, 


]);



export default App;
