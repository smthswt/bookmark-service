/* global kakao */
import React, {useEffect, useState} from "react";
import {TextField, Button, Box} from "@mui/material";
import PlacesDialog from "./PlacesDialog";

const { kakao } = window;

export const KakaoMap = () => {
    const [storeName, setStoreName] = useState("")
    const [storeAddress, setStoreAddress] = useState("")
    const [storeContact, setStoreContact] = useState("")
    const [open, setOpen] = useState(false);

    const handleClose = () => {
    setOpen(false);
  };

    const handleBookmark = async () => {
      console.log("클릭한 가게 이름: ", storeName)

        try {
            const response = await fetch("http://localhost:5000/api/save_places", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ storeName, storeAddress, storeContact })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("DB에 저장된 가게 정보 :", data)
            console.log("서버로 가게 정보를 전달하고, 서버쪽에서 데이터베이스 테이블에 저장 완료!")
            setOpen(false);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };


    useEffect(() => {
    let markers = [];

    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.561259, 126.937059),
      level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const ps = new kakao.maps.services.Places();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    const searchPlaces = () => {
      const keyword = document.getElementById('keyword').value;

      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }

      ps.keywordSearch(keyword, placesSearchCB);
    };

    const placesSearchCB = (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    };

    const displayPlaces = (places) => {
      const listEl = document.getElementById('placesList');
      const bounds = new kakao.maps.LatLngBounds();

      removeAllChildNodes(listEl);
      removeMarkers();

      places.forEach((place, index) => {
        const placePosition = new kakao.maps.LatLng(place.y, place.x);
        const marker = addMarker(placePosition, index);
        const itemEl = getListItem(index, place);

        bounds.extend(placePosition);

        (function (marker, title) {
          kakao.maps.event.addListener(marker, 'mouseover', () => {
            displayInfowindow(marker, title);
          });

          kakao.maps.event.addListener(marker, 'mouseout', () => {
            infowindow.close();
          });

          itemEl.onmouseover = () => {
            displayInfowindow(marker, title);
          };

          itemEl.onmouseout = () => {
            infowindow.close();
          };

          itemEl.onclick = () => {
              setStoreName(place.place_name)
              setStoreAddress(place.road_address_name || place.address_name)
              setStoreContact(place.phone || '전화번호 없음')
              setOpen(true);

            // alert(
            //     '[가게 정보]\n' +
            //   `이름: ${place.place_name}\n` +
            //   `주소: ${place.road_address_name || place.address_name}\n` +
            //   `전화번호: ${place.phone || '전화번호 없음'}`
            // );
          };
        })(marker, place.place_name);

        listEl.appendChild(itemEl);
        if (index < places.length - 1) {
          const hr = document.createElement('hr');
          listEl.appendChild(hr);
        }
      });

      map.setBounds(bounds);
    };

    const getListItem = (index, place) => {
      const el = document.createElement('li');
      let itemStr = `<span class="markerbg marker_${index + 1}"></span>
        <div class="info">
          <h5>${place.place_name}</h5>`;

      if (place.road_address_name) {
        itemStr += `
          <span>${place.road_address_name}</span>
          <span class="jibun gray">${place.address_name}</span>`;
      } else {
        itemStr += `<span>${place.address_name}</span>`;
      }

      itemStr += `<br /><span class="tel">${place.phone}</span></div>`;

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    };

    const addMarker = (position, idx) => {
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
        offset: new kakao.maps.Point(13, 37)
      };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
      const marker = new kakao.maps.Marker({
        position,
        image: markerImage
      });

      marker.setMap(map);
      markers.push(marker);

      return marker;
    };

    const removeMarkers = () => {
      markers.forEach(marker => marker.setMap(null));
      markers = [];
    };

    const displayInfowindow = (marker, title) => {
      const content = `<div style="padding:5px;z-index:1; text-align: center;">${title}</div>`;
      infowindow.setContent(content);
      infowindow.open(map, marker);
    };

    const removeAllChildNodes = (el) => {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    };

    document.getElementById('searchBtn').addEventListener('click', searchPlaces);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="menu_wrap" className="bg_white" style={{
        position: 'fixed',
        top: '100px',
        left: '100px',
        width: '300px',
        zIndex: 10,
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="option">
          <Box>
            <TextField id="keyword" variant="outlined" placeholder="검색어를 입력하세요" fullWidth />
            <Button id="searchBtn" variant="contained" style={{ marginTop: '10px', width: '100%' }}>검색</Button>
          </Box>
        </div>
        <ul id="placesList" style={{ maxHeight: '400px', overflowY: 'auto', padding: '0', margin: '0', listStyleType: 'none' }}></ul>
      </div>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>

        <PlacesDialog
        open={open}
        handleBookmark={handleBookmark}
        handleClose={handleClose}
        storeName={storeName}
        storeAddress={storeAddress}
        storeContact={storeContact}
      />
    </div>
  );
};
