import ScreenHeaderBtn from "./common/header/ScreenHeaderBtn";

// home screen
import Welcome from "./home/welcome/Welcome";
import TrainingList from "./home/nearby/TrainingList";
import DrawerContent from './drawer-content/DrawerContent.jsx'
import StartingPage from './login/StartingPage.jsx'
import LoginScreen from './login/LoginPage.jsx'
import RegisterPage from './login/RegisterPage.jsx'
import Profile from './profile/Profile.jsx'
import TrainingScreen from './training/TrainingScreen.jsx'

// job details screen
import Company from "./jobdetails/company/Company";
import { default as JobTabs } from "./jobdetails/tabs/Tabs";
import { default as JobAbout } from "./jobdetails/about/About";
import { default as JobFooter } from "./jobdetails/footer/Footer";
import Specifics from "./jobdetails/specifics/Specifics";

// common
import NearbyJobCard from "./common/cards/nearby/NearbyJobCard";

export {
  ScreenHeaderBtn,
  Welcome,
  TrainingList,
  Company,
  JobTabs,
  JobAbout,
  JobFooter,
  Specifics,
  NearbyJobCard,
  DrawerContent,
  StartingPage,
  LoginScreen,
  RegisterPage,
  Profile,
  TrainingScreen
};
