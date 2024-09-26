import {useContext} from 'react';
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/navbar";
import {useNavigate, Link, Outlet} from "react-router-dom";
import FnirsContext from "../tools/contextStore";

// This component is responsible for main dashboard after successfull login
// This also includes navigation bar, which is responsible with mobile view

export default function Dashboard(){
    // Import states from the context store
    const {removefnirsCookie, sideMenu, setSideMenu, liveStreamPageActive, infoPageActive, currentImage} = useContext(FnirsContext);
    const navigate = useNavigate();
    // Remove secure cookie in case user is logged out
    const authCookieRemover = ()=>{
        removefnirsCookie('fNIRS-Cookie');
        navigate('/');
    };
    // Main component definition
    return (
        <div>
            <Navbar onMenuOpenChange={setSideMenu} maxWidth='full' isBordered>
                <NavbarContent>
                    <NavbarMenuToggle aria-label={sideMenu ? "Close menu" : "Open menu"} className="sm:hidden"/>
                    <NavbarBrand>
                        <Image height={60} alt="Main Logo" src={currentImage} radius="md" isBlurred/>
                        <p className="font-sans font-semibold">fNIRS Dashboard</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link className={liveStreamPageActive} to="/dashboard/livestream">Live Stream</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className={infoPageActive} to="/dashboard/info">Session Information</Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="end">
                    <NavbarItem>
                        <Button color="danger" variant="shadow" onPress={authCookieRemover}>Logout</Button>
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    <NavbarMenuItem>
                        <Link className={liveStreamPageActive} to="/dashboard/livestream">Live Stream</Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link className={infoPageActive} to="/dashboard/info">Session Information</Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Button color="danger" variant="shadow" onPress={authCookieRemover}>Logout</Button>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
            <Outlet />
        </div>
    );
}
