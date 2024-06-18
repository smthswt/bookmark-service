import React, { useEffect } from "react";
import { TextField, Button } from "@mui/material";

const { kakao } = window;

export const KakaoMap2 = () => {
  useEffect(() => {
    let markers = [];

    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(37.561259, 126.937059),
      level: 2
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const ps = new kakao.maps.services.Places();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 지도 클릭 위치에 마커 표시 및 가게 이름 포함 기능 추가
    var marker = new kakao.maps.Marker({
      position: map.getCenter()
    });
    marker.setMap(map);

    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      var latlng = mouseEvent.latLng;
      marker.setPosition(latlng);

        // 음식점(FD6) 및 카페(CE7) 카테고리 검색
      searchNearbyPlaces(latlng, ['FD6', 'CE7']);
    });

    const searchNearbyPlaces = (latlng, categories) => {
      let promises = categories.map(category => new Promise((resolve, reject) => {
        ps.categorySearch(category, (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            resolve(data);
          } else {
            resolve([]);
          }
        }, {
          location: latlng,
          radius: 10 // 반경 50미터 내 검색
        });
      }));

      Promise.all(promises).then(results => {
        let places = results.flat();
        if (places.length > 0) {
          const place = places[0]; // 첫 번째 결과를 사용
          var message = '클릭한 위치의 위도는 ' + place.y + ' 이고, ';
          message += '경도는 ' + place.x + ' 입니다. ';
          message += '가게 이름은 ' + place.place_name + ' 입니다.';

          console.log(message);
          alert(message);
        } else {
          alert('주변에 가게가 없습니다.');
        }
      }).catch(error => {
        alert('검색 결과 중 오류가 발생했습니다.');
        console.error(error);
      });
    };

  }, []);

  return (
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
  );
};
