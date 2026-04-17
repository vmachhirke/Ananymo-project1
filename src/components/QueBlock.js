import {Link} from 'react-router-dom';

function QueBlock(props){
    return(
     
<div class="card m-3">

        <div className="card-header">
            <div className="row">
                <div className="col col-lg-3">{props.votes} votes</div>
                <div className="col col-lg-3"><span className="badge text-bg-success">{props.ans_count} answers</span></div>
                <div className="col col-lg-3">{props.view_count} views</div>
            </div>
        </div>
  <div class="card-body">
    <Link to={`/questions/view?qid=${props.q_id}`} state={{ scrollToTop: true }}  class="text-decoration-none " >{props.q_title}</Link>
    <p style={{fontWeight:"400"}} className='card-text'>{props.q_desc}</p>
    {/* <div className="tags">
        <Link className="badge text-bg-primary m-1" style={{fontWeight:"200"}}>
            python
        </Link>
    </div> */}
  </div>
  <div class="card-footer " style={{fontWeight:"300"}}>
  <div className="row float-end">
    <div className="col">
        <img className='card rounded-circle d-inline' width={"30px"} src={props.img} alt="" />
        <span className='ms-1 text-primary'>{props.username}</span>
        <span className='ms-1'>asked on {props.posted_on}</span>
    </div>

  </div>
    
  </div>
</div>
    )
}


function QueBlockLoading(){
    return(
     
<div class="card m-3 placeholder-glow">

        <div className="card-header">
            <div className="row justify-content-between">
                <div className="col col-lg-3 placeholder"></div>
                <div className="col col-lg-3 placeholder"></div>
                <div className="col col-lg-3 placeholder"></div>
            </div>
        </div>
  <div class="card-body ">
    <div className="col-10 placeholder"></div>
    <div className="col-8 placeholder"></div><br/>
    <div className="col-6 placeholder"></div><br/>
    <div className="col-3 placeholder"></div>
   
  </div>
  <div class="card-footer " style={{fontWeight:"300"}}>
  <div className="row justify-content-end gap-3 ">
    <div className="col-3 placeholder">
    </div><div className="col-2 placeholder">
    </div>

  </div>
    
  </div>
</div>
    )
}

export  {QueBlock,QueBlockLoading};