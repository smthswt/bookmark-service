import React, {useEffect, useState} from "react";
import "../pages/css/Links.css";
import { Box, IconButton, Typography, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import UrlDialog from "./components/UrlDialog";

const LinksPage = () => {
    const [boxes, setBoxes] = useState([]);

    const [open, setOpen] = useState(false);
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [linksData, setLinksData] = useState([])

    const handleClose = () => {
        setOpen(false);
    };

    const handleBookmark = async () => {
    const displayName = siteName.length > 6 ? siteName.substring(0, 6) + '..' : siteName;
    console.log("hanlde links bookmark")

    // const newLink = (
    //     <Button style={{ padding: 10, width: "90px" }}>
    //         <a href={siteUrl} target="_blank" rel="noopener noreferrer" style={{
    //             textDecoration: 'none', color: 'inherit', display: 'flex',
    //             flexDirection: 'column', alignItems: 'center'
    //         }}>
    //             <Box style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
    //                 <Box style={{
    //                     display: 'flex', border: "1px solid grey", height: "55px", width: "55px",
    //                     alignItems: 'center', justifyContent: "center", marginBottom: 10, borderRadius: "30px"
    //                 }}>
    //                     <Typography variant="h6" component="span" color={"black"}>
    //                         {siteName.charAt(0).toUpperCase()}
    //                     </Typography>
    //                 </Box>
    //                 <Typography variant="body1" align="center" color={"black"}>
    //                     {displayName}
    //                 </Typography>
    //             </Box>
    //         </a>
    //     </Button>
    // );

        const newLink = {
            site_name: siteName,
            site_url: siteUrl
        };

    try {
        const response = await fetch("http://localhost:5000/api/save_links", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ site_name: siteName, site_url: siteUrl })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log("DB에 저장된 바로가기 정보 :", data);
        console.log("서버로 바로가기 정보를 전달하고, 서버쪽에서 데이터베이스 테이블에 저장 완료!");
        setLinksData(prevLinks => [...prevLinks, newLink]);

    handleClose()
    } catch (error) {
        console.error('Failed to fetch:', error);
    }

};

    const handleAddBox = () => {
        setOpen(true);
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
            console.log("DB에 가져온 가게 정보 :", data)
            setLinksData(Array.isArray(data.links) ? data.links : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    useEffect(() => {
        handleGetLinksData()
    }, []);

    return (
        <div className="LinkPage" style={{
            display: "flex", flexDirection: "row",
            justifyContent: "center", alignItems: 'center',
            width: "fit-content",
            margin: "0px 100px",
        }}>

            {linksData.map((link, index) => (
                <Button key={index} style={{ padding: 10, width: "90px" }}>
                    <a href={link.site_url} target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: 'none', color: 'inherit', display: 'flex',
                        flexDirection: 'column', alignItems: 'center'
                    }}>
                        <Box style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                            <Box style={{
                                display: 'flex', border: "1px solid grey", height: "55px", width: "55px",
                                alignItems: 'center', justifyContent: "center", marginBottom: 10, borderRadius: "30px"
                            }}>
                                <Typography variant="h6" component="span" color={"black"}>
                                    {link.site_name.charAt(0).toUpperCase()}
                                </Typography>
                            </Box>
                            <Typography variant="body1" align="center" color={"black"}>
                                {link.site_name.length > 6 ? link.site_name.substring(0, 6) + '..' : link.site_name}
                            </Typography>
                        </Box>
                    </a>
                </Button>
            ))}

            <Button onClick={handleAddBox} style={{ padding: 10 }}>
                <Box style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                    <Box style={{
                        display: 'flex', border: "1px solid grey", height: "55px", width: "55px",
                        alignItems: 'center', justifyContent: "center", marginBottom: 10, borderRadius: "30px"
                    }}>
                        <AddIcon />
                    </Box>
                    <Typography variant="body1" align="center">
                        바로가기 추가
                    </Typography>
                </Box>
            </Button>

            <UrlDialog
                open={open}
                handleBookmark={handleBookmark}
                handleClose={handleClose}
                siteName={siteName}
                setSiteName={setSiteName}
                siteUrl={siteUrl}
                setSiteUrl={setSiteUrl}
            />
        </div>
    );
}

export default LinksPage;
