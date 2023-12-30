import { useEffect, useState } from "react";
import { Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PaymentIcon from '@mui/icons-material/Payment';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import FeedbackIcon from '@mui/icons-material/Feedback';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavButton from "../mui/NavButton";
import { useLocation, useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SideDrawer from "../mui/SideDrawer";
import PortalPopup from "./PortalPopup";
import Popup from "./popups/Popup";
import { useSnackbar } from "../hooks/useSnackbar";

const NavBar = () => {
  const { handleSnackbarOpen } = useSnackbar();

  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('');
  const [logoutPopup, setLogoutPopup] = useState(false);

  const openLogoutPopup = () => {
    setLogoutPopup(true);
  }

  const closeLogoutPopup = () => {
    setLogoutPopup(false);
  }
  const onLogout = () => {
    sessionStorage.clear();
    navigate('/login');
    handleSnackbarOpen('Logged Out Successfully', 'success')
  }

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  // useEffect(() => {
  //   const scrollAnimElements = document.querySelectorAll(
  //     "[data-animate-on-scroll]"
  //   );
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       for (const entry of entries) {
  //         if (entry.isIntersecting || entry.intersectionRatio > 0) {
  //           const targetElement = entry.target;
  //           targetElement.classList.add(styles.animate);
  //           observer.unobserve(targetElement);
  //         }
  //       }
  //     },
  //     {
  //       threshold: 0.15,
  //     }
  //   );

  //   for (let i = 0; i < scrollAnimElements.length; i++) {
  //     observer.observe(scrollAnimElements[i]);
  //   }

  //   return () => {
  //     for (let i = 0; i < scrollAnimElements.length; i++) {
  //       observer.unobserve(scrollAnimElements[i]);
  //     }
  //   };
  // }, []);

  const tabs = [
    {
      icon: <HomeIcon />,
      name: "Home",
      active: currentPage === '/home',
      location: "/home"
    },
    {
      icon: <AddBusinessIcon />,
      name: "Services",
      active: currentPage === '/services',
      location: "/services"
    },
    {
      icon: <PaymentIcon />,
      name: "Payments",
      active: currentPage === '/payments',
      location: "/payments"
    },
    {
      icon: <DateRangeIcon />,
      name: "Attendance",
      active: currentPage === '/attendance',
      location: "/attendance"
    },
    {
      icon: <FeedbackIcon />,
      name: "Feedback",
      active: currentPage.startsWith('/feeds'),
      location: "/feeds?tab=Complaint"
    },
    {
      icon: <NotificationsIcon />,
      name: "Notification",
      active: currentPage === '/notifications',
      location: "/notifications"
    }
  ];


  return (
    <>
      <SideDrawer tabs={tabs} />

      <nav className=" hidden tab:flex tab:w-[300px] bg-slate-100 fixed h-screen overflow-y-auto">
        <div className="flex flex-col w-full space-y-5">
          <div className="flex flex-row w-full justify-center pb-5 border-b-2 p-5">
            <img
              className=" w-14 h-14"
              alt=""
              src="/ellipse-1.svg"
            // data-animate-on-scroll
            />
            <div className=" hidden tab:flex flex-col justify-center tab:px-1 xl:px-4 w-full ">
              <h3 className="flex w-full text-gray-850 font-medium text-lg">Anna George</h3>
              <p className="flex text-slate-400 font-medium text-sm ">
                HN-512
              </p>
            </div>
            <span className="hidden xl:flex items-center">
              <VerifiedIcon className="text-green-700" />
            </span>
          </div>

          {tabs.map((tab, index) => (
            <NavButton key={index} icon={tab.icon} name={tab.name} active={tab.active} location={tab.location} />
          ))}

          <hr className="bg-gray-300 h-[2px] " />

          <div className="px-5">
            <NavButton icon={<ManageAccountsIcon />} name={'User Settings'} active={currentPage.startsWith('/updateDetails')} location={'/updateDetails?tab=Update+Details'} />

            <div className="hidden tab:flex items-center justify-center">
              <Button
                color="error"
                fullWidth
                size="large"
                sx={{ paddingY: '12px', backgroundColor: '#fee2e2' }}
                endIcon={<ExitToAppIcon sx={{ marginLeft: '8px' }} />}
                onClick={openLogoutPopup}
              >Logout</Button>
            </div>
          </div>
        </div>
      </nav>
      <>
        {logoutPopup &&
          <PortalPopup overlayColor="rgba(0, 0, 0, 0.7)" placement="Centered" onOutsideClick={closeLogoutPopup} >
            <Popup heading='Do you want to Logout ?' subText='You will be logged out of the session.' icon={'/icons/edit.svg'} onClose={closeLogoutPopup} onConfirm={onLogout} />
          </PortalPopup>}
      </>
    </>

  );
};

export default NavBar;