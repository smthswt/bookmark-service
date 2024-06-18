import React, {useState} from "react";
import {Input, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const LoginPage = () => {
    const [data, setData] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    // localStorage: 데이터가 브라우저를 닫아도 유지됨. 장기적인 사용자 로그인 상태 유지에 적합.
    // sessionStorage: 브라우저 탭이나 창이 닫히면 데이터가 삭제됨. / 일시적인 세션 데이터 저장에 적합.
    // localStorage를 선택한 이유 -> 이 서비스는 북마크로 바로 이동하거나 빠르게 확인할 수 있게 하는 것이 목적임.
    // 그래서 장기적인 로그인 상태 유지로 로그인이라는 액션을 최소화함.
    // localStorage는 데이터에 자주 접근해야 하거나 큰 데이터를 저장할 때 유용하지만, 민감한 데이터를 저장하는 데는 적합하지 않습니다.
    // 쿠키는 특히 세션 관리와 보안이 중요한 민감한 데이터를 저장할 때 더 적합합니다. HTTP-only 쿠키는 JavaScript로 접근할 수 없으므로,
    // XSS 공격으로부터 더 안전합니다.

    // axios를 활용한 api 통신 방법
    const handleLogin = async (event) => {
        event.preventDefault();
        console.log("로그인 버튼 클릭");

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password
            }, {
                //헤더는 flask api 서버에 어떤 데이터로 전송할지 지정하는 것.
                // json으로 보내겠다고 지정한 이유는 서버쪽에서 data=request.get_json()으로 데이터를 받고 있기 때문.
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setData(response.data);
            console.log("login data :", response.data);
            if (response.data.success) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                navigate("/links");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert("500: 서버 통신 오류");
        }
    };

    //fetch를 활용한 api, 통신 확인 성공
    // const handleLogin = async (event)=> {
    //     event.preventDefault();
    //     const response = await fetch("http://localhost:5000/api/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type" : "application/json",
    //         },
    //         body: JSON.stringify({username, password})
    //     });
    //     const data = await response.json();
    //     console.log(data)
    // }

    const handleRefresh = async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        try {
            const response = await axios.post('http://localhost:5000/api/refresh', {
                refresh_token
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem('access_token', response.data.access_token);
            console.log('토큰 갱신 성공');
        } catch (error) {
            console.error('토큰 갱신 오류', error);
        }
    };

    return(
        <div style={{display:'flex', width: "30%", height:"300px", borderRadius: 20,
            border: "2px solid black", justifyContent: "center", alignItems: 'center',
        flexDirection: "column"}}>

            <form onSubmit={handleLogin} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90%'
            }}>
                <TextField
                    required
                    id="user-id"
                    variant={"outlined"}
                    label="아이디"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{marginBottom: 15, width:"50%"}}
                />
                <br/>
                <TextField
                    required
                    id="user-password"
                    variant={"outlined"}
                    label="비밀번호"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{marginBottom: 15, width:"50%"}}
                />
            <br/>
            {/*<Button variant={"contained"} onClick={handleLogin}>*/}
            <Button variant={"contained"} type={"submit"} style={{width:"30%"}}>
                로그인
            </Button>
                </form>
        </div>
    )
}

