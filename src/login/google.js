
import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Session from "react-session-api";
import axios from "axios";

const GoogleLoginButton = () => {
    const history = useNavigate();

    const clientId = '567662946789-14jcm3so0ild3dt2qgn7v719ial9hqk4.apps.googleusercontent.com'
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);
                        // alert("환영합니다");
                        // history("/testmain");

                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                    size="large"
                    width="300px"
                    type="standard"
                    theme="outline"
                    
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton
