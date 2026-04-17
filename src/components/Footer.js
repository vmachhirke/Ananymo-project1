import "../assets/styles/Footer.css";

import { Link } from 'react-router-dom';
import ScrollTop from "./ScrollTop";

function Footer() {
    return (
        <footer class="footer">
            <div class="container">
                <div class="row justify-content-center">
                    <div className="col-md-4  ">
                        <h2 class="footer-heading mb-1 text-center">ANONYMO</h2>
                        <p className="t text-center">Ananymo is the dynamic knowledge-sharing community where tech enthusiasts, developers, and experts collaborate to collectively solve challenges and support each other's growth.</p>
                    </div>
                    <div class="col-md-4 text-center ">

                        <p class="menu">
                            <Link to="/" >Home</Link>
                            <Link to="/about" >About</Link>
                            <Link to="/ask-question" >Ask Question</Link>
                        </p>
                        <ul class="ftco-footer-social p-0">
                            <li class="ftco-animate"><a target="blank" href="https://github.com/vmachhirke" data-toggle="tooltip" data-placement="top" title="Github"><i class="bi bi-github"></i></a></li>
                            <li class="ftco-animate"><a target="blank" href="https://www.instagram.com/its.vaishnavi2103/" data-toggle="tooltip" data-placement="top" title="Instagram"><i class="bi bi-instagram"></i></a></li>
                            <li class="ftco-animate"><a target="blank" href="#" data-toggle="tooltip" data-placement="top" title="Facebook"><i class="bi bi-facebook"></i></a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 text-center ps-5">
                        <form>
                            <h5 className="mb-4" style={{color:'#fff'}}>Subscribe to our newsletter</h5>
                            <div class="d-flex flex-column flex-sm-row w-100 gap-2">
                                <label for="newsletter1" class="visually-hidden">Email address</label>
                                <input id="newsletter1" type="text" class="form-control" placeholder="Email address"/>
                                    <button class="btn btn-outline-primary" type="button">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <div class="mt-5 attr pt-3 pb-1">
                <div class="col-md-12 text-center">
                    <p class="copyright">
                        Copyright &copy;2026 ANONYMO
                    </p>
                </div>
            </div>
<ScrollTop/>
        </footer>
    );
}

export default Footer;
