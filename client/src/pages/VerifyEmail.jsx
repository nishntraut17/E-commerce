/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, CircularProgress } from "@mui/material";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const VerifyEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    let token = localStorage.getItem("token");
    const [user, setUser] = useState(null);

    const emailToken = searchParams.get("emailToken");

    useEffect(() => {
        const verificationCheck = async () => {
            console.log(user);
            if (user?.isVerified) {
                const timeoutId = setTimeout(() => {
                    navigate("/");
                }, 2000);

                return () => clearTimeout(timeoutId);
            } else {
                if (emailToken) {
                    setIsLoading(true);
                    try {
                        const response = await axios.post(
                            `http://localhost:5000/api/user/verify-email`,
                            {
                                emailToken: emailToken
                            }
                        );
                        setIsLoading(false);
                        console.log("res", response);

                        if (response.data.error) {
                            return setError(response.data);
                        }
                        console.log(response.data);
                        localStorage.setItem("token", response.data);
                        token = localStorage.getItem("token");
                        setUser(jwtDecode(token));
                    } catch (error) {
                        setIsLoading(false);
                        setError({ error: true, message: "An error occurred while verifying email." });
                    }
                }
            }
        }
        verificationCheck();
    }, [emailToken, user, navigate]);

    return (
        <div>
            {isLoading ? (
                <div>
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {user?.isVerified ? (
                        <div>
                            <Alert severity="success">
                                Email successfully verified, redirecting to Home Page ...
                            </Alert>
                        </div>
                    ) : (
                        <div>
                            {error.error ? (
                                <Alert severity="error">{error.message}</Alert>
                            ) : null}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;
