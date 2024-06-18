import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GiHamburgerMenu } from "react-icons/gi";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FolderIcon from '@mui/icons-material/Folder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import axios from "axios";


export default function LeftDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  //menu 아이콘 클릭하면 drawer open
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  //홈 경로로 이동
  const handleToHome = () => {
    console.log("링크 북마크로 이동합니다.")
      // navigate("/home")
      navigate("/home")
  }

  //링크 북마크 페이지로 이동
  const handleToLink = () => {
    console.log("링크 북마크로 이동합니다.")
      navigate("/links")
  }

  const handleToPlaces = () => {
    console.log("장소 페이지 북마크로 이동합니다.")
      navigate("/places")
  }

  const handleToPlaces2 = () => {
    console.log("장소 페이지 2로 이동합니다.")
      navigate("/places2")
  }

   const handleToMyPage = () => {
      console.log("마이페이지로 이동")
       navigate("/profile")
  }

    const handleLogout = async () => {
            console.log("로그아웃 버튼 클릭");
            const accessToken = localStorage.getItem('access_token');
            console.log(`Access Token: ${accessToken}`);

            try {
                const response = await axios.post('http://localhost:5000/api/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
                console.log("로그아웃 응답:", response.data);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate("/");
                alert("로그아웃 되었습니다.");
            } catch (error) {
                console.error('There was an error!', error);
                alert("500: 서버 통신 오류");
            }
        };


  //drawer menu 목록 -> 링크, 장소, 책 / 마이페이지, 로그아웃
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["홈", '링크', '장소', '장소2'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={index === 0 ? handleToHome : index === 1 ? handleToLink : index ===2 ? handleToPlaces : handleToPlaces2}>
              <ListItemIcon>
                {/* 메뉴 아이콘 */}
                  {index === 0 ? <HomeIcon /> : <></>}
                  {index === 1 ? <FolderIcon /> : <></>}
                {index === 2 ? <LocationOnIcon /> : <></>}
                  {index === 3 ? <LocationOnIcon /> : <></>}
                {/*{index === 3 ? <BookmarkIcon /> : <></>}*/}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {['마이 페이지', '로그아웃'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={index === 0 ? handleToMyPage : handleLogout}>
              <ListItemIcon>
                {/* 아이콘 - 마이 페이지 : 로그아웃 */}
                {index % 2 === 0 ? <AccountCircleIcon /> : <LogoutIcon />}

              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
      <div>
          <Button onClick={toggleDrawer(true)}
                  style={{top: '16px', left: '16px', position: 'absolute', zIndex: 1000}}>
              <GiHamburgerMenu size={22} color='black'/>
          </Button>
          <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
          </Drawer>
      </div>
  );
}
