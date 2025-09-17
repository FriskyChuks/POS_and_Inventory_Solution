import { Link } from 'react-router-dom';
import useAuth from '../accounts/useAuth';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
      <div className="navbar-menu-wrapper d-flex align-items-stretch justify-content-between">
        <Link className="navbar-brand brand-logo-mini align-self-center d-lg-none" to="/">
          <img src="/src/assets/images/logo-mini.svg" alt="logo" />
        </Link>

        <button className="navbar-toggler navbar-toggler align-self-center mr-2" type="button" data-toggle="minimize">
          <i className="mdi mdi-menu"></i>
        </button>

        <ul className="navbar-nav">
          {/* Notifications */}
          {/* <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
              <i className="mdi mdi-bell-outline"></i>
              <span className="count count-varient1">7</span>
            </a>
            <div className="dropdown-menu navbar-dropdown navbar-dropdown-large preview-list" aria-labelledby="notificationDropdown">
              <h6 className="p-3 mb-0">Notifications</h6>
              
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <img src="/src/assets/images/faces/face4.jpg" alt="" className="profile-pic" />
                </div>
                <div className="preview-item-content">
                  <p className="mb-0">Dany Miles <span className="text-small text-muted">commented on your photo</span></p>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <p className="p-3 mb-0">View all activities</p>
            </div>
          </li> */}

          {/* Messages */}
          {/* <li className="nav-item dropdown d-none d-sm-flex">
            <a className="nav-link count-indicator dropdown-toggle" id="messageDropdown" href="#" data-toggle="dropdown">
              <i className="mdi mdi-email-outline"></i>
              <span className="count count-varient2">5</span>
            </a>
            <div className="dropdown-menu navbar-dropdown navbar-dropdown-large preview-list" aria-labelledby="messageDropdown">
              <h6 className="p-3 mb-0">Messages</h6>

              <a className="dropdown-item preview-item">
                <div className="preview-item-content flex-grow">
                  <span className="badge badge-pill badge-success">Request</span>
                  <p className="text-small text-muted ellipsis mb-0">Support needed for user123</p>
                </div>
                <p className="text-small text-muted align-self-start">4:10 PM</p>
              </a>
              <h6 className="p-3 mb-0">See all activity</h6>
            </div>
          </li> */}

          {/* Search */}
          <li className="nav-item nav-search border-0 ml-1 ml-md-3 ml-lg-5 d-none d-md-flex">
            <form className="nav-link form-inline mt-2 mt-md-0">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search" />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="mdi mdi-magnify"></i>
                  </span>
                </div>
              </div>
            </form>
          </li>
        </ul>

        {/* Right-side user menu */}
        <ul className="navbar-nav navbar-nav-right ml-lg-auto">
          {/* Language Dropdown */}
          <li className="nav-item dropdown d-none d-xl-flex border-0">
            <a className="nav-link dropdown-toggle" id="languageDropdown" href="#" data-toggle="dropdown">
              <i className="mdi mdi-earth"></i> English
            </a>
            {/* <div className="dropdown-menu navbar-dropdown" aria-labelledby="languageDropdown">
              <a className="dropdown-item" href="#">French</a>
              <a className="dropdown-item" href="#">Spanish</a>
              <a className="dropdown-item" href="#">Latin</a>
              <a className="dropdown-item" href="#">Japanese</a>
            </div> */}
          </li>

          {/* Authenticated User Profile */}
          <li className="nav-item nav-profile dropdown border-0">
            {isAuthenticated && user ? (
              <>
                <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown">
                  <i className="mdi mdi-account menu-icon"></i>
                  <span className="profile-name">
                    {user.firstname || ''} {user.lastname || ''}
                  </span>
                </a>
                <div className="dropdown-menu navbar-dropdown w-100" aria-labelledby="profileDropdown">
                  <a className="dropdown-item" href="#">
                    <i className="mdi mdi-cached mr-2 text-success"></i> Activity Log
                  </a>
                  <a href="#" className="dropdown-item" onClick={logout}>
                    <i className="mdi mdi-logout mr-2 text-primary"></i> Signout
                  </a>
                </div>
              </>
            ) : (
              <Link to="/auth/login" className="btn btn-primary">Login</Link>
            )}
          </li>
        </ul>

        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
