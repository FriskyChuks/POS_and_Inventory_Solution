import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../accounts/useAuth';

const SideBar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
        {/* <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
          <a className="sidebar-brand brand-logo" href="index.html"><img src="src/assets/images/logo.svg" alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini pl-4 pt-3" href="index.html"><img src="assets/images/logo-mini.svg" alt="logo" /></a>
        </div> */}
        
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a href="#" className="nav-link">
              <div className="nav-profile-image">
                <img src="src/assets/images/faces/face1.jpg" alt="profile" />
                <span className="login-status online"></span>
                {/* <!--change to offline or busy as needed--> */}
              </div>
              <div className="nav-profile-text d-flex flex-column pr-3">
                <span className="font-weight-medium mb-2">{user.firstname} {user.lastname}</span>
                {/* <span className="font-weight-normal">$8,753.00</span> */}
              </div>
              <span className="badge badge-danger text-white ml-3 rounded">3</span>
            </a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="mdi mdi-home menu-icon"></i>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#ui-items" aria-expanded="false" aria-controls="ui-items">
              <i className="mdi mdi-package-variant menu-icon"></i>
              <span className="menu-title">Items</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-items">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/item-list">Item List</Link>
                </li>
                { user.user_group.title === 'manager' || user.user_group.title === 'admin' ? 
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/item-create">Create Item</Link>
                  </li> 
                  <li className="nav-item">
                    <Link className="nav-link" to="/brand-create">Create Brand</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/brand-list">Brand List</Link>
                  </li>
                </> : ''
                }                
              </ul>
            </div>
          </li>
          
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#ui-sales" aria-expanded="false" aria-controls="ui-sales">
            <i class="mdi mdi-currency-ngn menu-icon"></i>
              <span className="menu-title">Sales</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-sales">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/sales">Make Sales</Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/sales-history">Sales Report</Link>
                </li> */}
              </ul>
            </div>
          </li>

          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#ui-reports" aria-expanded="false" aria-controls="ui-reports">
            <i className="mdi mdi-file-chart menu-icon"></i>
              <span className="menu-title">Reports</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-reports">
              <ul className="nav flex-column sub-menu">
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/sales">General Report</Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/reports/profit-loss">Profit/Loss Reports</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sales-history">Sales Report</Link>
                </li>
              </ul>
            </div>
          </li>
          {/* SUPPLIES */}
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#ui-supplies" aria-expanded="false" aria-controls="ui-supplies">
            <i className="mdi mdi-file-chart menu-icon"></i>
              <span className="menu-title">Supplies</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-supplies">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/supply-create">Receive Supply</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/supply-list">Supply List</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/suppliers">Suppliers List</Link>
                </li>
              </ul>
            </div>
          </li>
          {/* MANAGEMENT */}
          <li className="nav-item">
            <a className="nav-link" data-toggle="collapse" href="#ui-management" aria-expanded="false" aria-controls="ui-management">
            <i className="mdi mdi-settings menu-icon"></i>
              <span className="menu-title">Management</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-management">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/management/price-settings">Price Setting</Link>
                </li>
              </ul>
            </div>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link" href="pages/forms/basic_elements.html">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title">Forms</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="pages/charts/chartjs.html">
              <i className="mdi mdi-chart-bar menu-icon"></i>
              <span className="menu-title">Charts</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="pages/tables/basic-table.html">
              <i className="mdi mdi-table-large menu-icon"></i>
              <span className="menu-title">Tables</span>
            </a>
          </li>
          <li className="nav-item">
            <span className="nav-link" href="#">
              <span className="menu-title">Docs</span>
            </span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="https://www.bootstrapdash.com/demo/breeze-free/documentation/documentation.html">
              <i className="mdi mdi-file-document-box menu-icon"></i>
              <span className="menu-title">Documentation</span>
            </a>
          </li> */}
          <li className="nav-item sidebar-actions">
            <div className="nav-link">
              <div className="mt-4">
                <div className="border-none">
                  <p className="text-black">Notification</p>
                </div>
                <ul className="mt-4 pl-0">
                  <li onClick={logout}>Sign Out</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        </nav>
    </>
  )
}

export default SideBar