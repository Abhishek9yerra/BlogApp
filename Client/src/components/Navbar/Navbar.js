import React from 'react'
import Logo from '../Assets/logo.png'
import './Navbar.css';
import {NavLink} from 'react-router-dom'

function Navbar() {
    return(
        <div className='navbar'>
            <div className='logo'>
            <img src={Logo} alt="" className='width:20px' />
            </div>
            <div>
                <ul>
                    <li><NavLink className='nav-item' to=''>Home</NavLink></li>
                    <li><NavLink className='nav-item' to='signup'>signup</NavLink></li>
                    <li><NavLink className='nav-item' to='signin'>signin</NavLink></li>
                </ul>
            </div>

    
        </div>
    )

}
export default Navbar
