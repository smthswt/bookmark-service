import React, {useEffect, useState} from "react";
import {Container, Typography} from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const Homepage = () => {
    const [value, setValue] = React.useState(0);
    const [placesData, setPlacesData] = useState([])
    const [linksData, setLinksData] = useState([])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGetPlacesData = async () => {

        try {
            const response = await fetch("http://localhost:5000/api/get_all_places", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("DB에 가져온 가게 정보 :", data)
            setPlacesData(Array.isArray(data.places) ? data.places : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };


  const handleGetLinksData = async () => {

        try {
            const response = await fetch("http://localhost:5000/api/get_all_links", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("DB에 가져온 바로가기 정보 :", data)
            setLinksData(Array.isArray(data.links) ? data.links : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };


    useEffect(() => {
        handleGetPlacesData()
        handleGetLinksData()
    }, []);

  return (
    <Box
      sx={{
        width: "90vw",
        height: "88vh",
        // bgcolor: 'lightyellow',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="자주 방문하는 사이트" {...a11yProps(0)} sx={{ color: 'black', fontWeight: 700, fontSize: 18 }} />
          <Tab label="나중에 갈 장소" {...a11yProps(1)}  sx={{ color: 'black', fontWeight: 700, fontSize: 18 }}/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
          <ul style={{paddingLeft: '20px'}}>
                {linksData.map((link, index) => (
                    <li key={index} style={{marginBottom: '10px'}}>
                        <Typography variant="h6" component="div">
                            {link.site_name}
                        </Typography>
                        <Typography variant="body2" component="div">
                            {link.site_url}
                        </Typography>
                    </li>
                ))}
            </ul>
      </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
            <ul style={{paddingLeft: '20px'}}>
                {placesData.map((place, index) => (
                    <li key={index} style={{marginBottom: '10px'}}>
                        <Typography variant="h6" component="div">
                            {place.store_Name}
                        </Typography>
                        <Typography variant="body2" component="div">
                            {place.store_Address}
                        </Typography>
                        <Typography variant="body2" component="div">
                            {place.store_Contact}
                        </Typography>
                    </li>
                ))}
            </ul>
        </CustomTabPanel>
    </Box>
  );
}

export default Homepage;