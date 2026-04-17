function Spinner(props){
return(
    <div className={`w-100 h-100  position-fixed fixed-top d-flex justify-content-center align-items-center ${props.display}`} style={{zIndex:"1000",backgroundColor: "#8a2be287"}}>
<div >
<div class="spinner-grow text-success m-1 shadow-lg" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-grow text-danger m-1" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-grow text-warning m-1" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

</div>
    </div>
)
}

export default Spinner