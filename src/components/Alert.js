function Alert(props) {
  return (
    <>
      <div
        class={`alert ${props.alert} alert-dismissible fade ${props.show} ms-5 me-5 position-fixed top-0 container`}
        role="alert">
      {props.title}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"></button>
      </div>
    </>
  );
}

export default Alert;
