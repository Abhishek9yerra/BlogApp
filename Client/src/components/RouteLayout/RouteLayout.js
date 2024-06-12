import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

function RouteLayout(){
    return(
        <div>
            <Navbar/>
            <div style={{minWidth:700}}>
            <Outlet/>
            </div>
            <Footer/>

        </div>
        
    )

}
export default RouteLayout;
