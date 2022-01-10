/*
Login.js
Author: Derek Jeong
Description: Login.js is a react hook component for login sequence of the Restaurant App.
This file provides all functions relates with authentication and backend connection.
*/

import React, { useState } from "react";
import {Form, Modal} from "react-bootstrap";
import { useAppContext, useFailedMessageContext, usePermissionLevelContext, useLogoutErrorContext } from "../../libs/contextLib";
import { Button, Grid } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import Alert from '@material-ui/lab/Alert';
import "./Login.css";

export default function Login() {
        const history = useHistory();
        const [form, setForm] = useState({});
        const [errors, setErrors] = useState({});
        const [loginFailed, setLoginFailed] = useState(false);

        // context Lib
        // const { setPermissionLevel } = usePermissionLevelContext();
        const { userHasAuthenticated } = useAppContext();
        const { failedMessage, setFailedMessage } = useFailedMessageContext();
        // const { logoutError } = useLogoutErrorContext();

        const formList =  [
                { label: 'Business Name', error: errors.businessName, type: 'text', fieldName: 'businessName' },
                { label: 'Access Code', error: errors.accessCode, type: 'password', fieldName: 'accessCode' },
        ];

        const setField = (field, value) => {
                setForm({
                  ...form,
                  [field]: value
                })
        // Check and see if errors exist, and remove them from the error object:
                if ( !!errors[field] ) setErrors({
                  ...errors,
                  [field]: null
                })
        }

        // this function is for printing out form errors from user input
        const findFormErrors = () => {
                const { businessName, accessCode } = form
                const newErrors = {};
                
                if (!businessName || businessName ==='') newErrors.businessName = 'This field cannot be blank'

                if (!accessCode || accessCode === '') newErrors.accessCode = 'This field cannot be blank'
                
                return newErrors
        }

        // this function creates form inputs with own label
        const constructListItem = (label, error, type, fieldName, i) => (
                <Grid item xs={label === "Access Code" ? 6 : 12} key={label} style={{marginTop: "15px", marginBottom: "10px", marginLeft: label === "Access Code" ? "10px" : "0"}}> 
                <Form.Group size="lg" controlId={`${label}`} key={i} className="form-contents">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                autoFocus
                type={`${type}`}
                onChange={(e) => setField(fieldName, e.target.value)}
                isInvalid={!!error}
                />
                <Form.Control.Feedback type='invalid'>
                        {error}
                </Form.Control.Feedback>
                </Form.Group>
                </Grid>
        );

        // This function implements login sequence with button click and fetch call to backend side
        async function handleLogin(event) {
                event.preventDefault();
                const newErrors = findFormErrors();

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors)
                } else {
                        await fetch("/auth/login-with-access-code", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                        businessName: form.businessName,
                                        accessCode: form.accessCode,      
                                }),
                        })
                        .then(async response => {
                                console.log(response.headers.get('Content-Type'))
                                const data =  await response.json();
                                console.log("-- cookie:", document.cookie.split("=")[1]);
                                console.log("-- data:", data);
                                console.log("-- res.status:", response.status);
                                setFailedMessage(data.message);
                                if(!response.ok || (Cookies.get('client-token') === null)){
                                        console.log("something went wrong", response.status);
                                        const error = (data && data.message) || response.status;
                                        return Promise.reject(error);
                                } else{
                                        if (response.ok) {
                                                console.log("--res.data:", data);
                                                console.log("--OK cookie:", Cookies.get('client-token'))
                                                userHasAuthenticated(true);
                                                
                                                localStorage.setItem("client-token", Cookies.get('client-token'));
                                                localStorage.setItem("loggedin-businessname", form.businessName);
                                                // localStorage.setItem("userId", data.data);
                                                history.push("/business/orders");
                                                window.location.reload();
                                        }
                                
                                        return response.data;
                                }
                        })
                        .catch((err) => {
                                setLoginFailed(true);
                                console.error("-- error:", err);
                        })
                        
                        console.log("end fetch call");
                }
        }

        // function handleLogout() {

        //         fetch('/auth/logout', {
        //                 method: 'POST',
        //                 port: 3080,
        //                 headers: { 
        //                         'Content-Type': 'application/json',
        //                         'Authorization': `Bearer ${AuthService.getCurrentUsertoken()}` 
        //                 }
        //         })
        //         .then(async res => {
        //                 const data = await res.json();
        //                 console.log("-- data:", data);
        //                 console.log("-- res.status:", res.status);
        //                 if(!res.ok){
        //                         console.log("something went wrong", res.status);
        //                         const error = (data && data.message) || res.status;
        //                         return Promise.reject(error);
        //                 } else{
        //                         userHasAuthenticated(false);
        //                         await AuthService.logout();
        //                         console.log(res.status, '[OK]');
        //                         history.push("/login");
                                        
        //                 }
        //         })
        //         .catch((err) => {
        //                 console.error("-- error:", err);
        //         })
    
        //         // redirect to login page after logged out
        //         console.log("end handleLogout fetch call");
        // }

        // Get Access Code part
        const [AcOpen, setAcOpen] = useState(false);
        const [AcFailed, setAcFailed] = useState(false);
        const [AcSuccess, setAcSuccess] = useState(false);

        // this function is for printing out form errors from user input
        const findFormErrorsAC = () => {
                const { getAC } = form
                const newErrors = {};

                if (!getAC || getAC === '') newErrors.getAC = 'This field cannot be blank'
                
                return newErrors
        }

        // This function triggers to open 'Get Access Code' modal
        const GetAcOpen = (event) => {
                event.preventDefault();
                setAcSuccess(false);
                setAcOpen(true);
        }

        const handleGetAcClose = () => {
                setAcOpen(false);
        }

        // This function implements generate access code sequence with button click and fetch call to backend side
        async function handleGetAC(event) {
                event.preventDefault();
                const newErrors = findFormErrorsAC();
                setAcFailed(false);

                if (Object.keys(newErrors).length > 0) {
                        setErrors(newErrors)
                } else {
                        await fetch("/auth/create-access-code", {
                                method: 'POST',
                                port: 3080,
                                headers: { 
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({
                                        businessName: form.getAC
                                }),
                        })
                        .then(async response => {
                                console.log(response.headers.get('Content-Type'))
                                const data =  await response.json();
                                console.log("-- data:", data);
                                console.log("-- res.status:", response.status);
                                setFailedMessage(data.message);
                                if(!response.ok || (Cookies.get('client-token') === null)){
                                        console.log("something went wrong", response.status);
                                        const error = (data && data.message) || response.status;
                                        return Promise.reject(error);
                                } else{
                                        if (response.ok) {
                                                console.log("--res.data:", data);
                                                console.log("--OK cookie:", Cookies.get('client-token'))
                                                setAcSuccess(true);
                                                handleGetAcClose();
                                        }
                                
                                        return response.data;
                                }
                        })
                        .catch((err) => {
                                setAcFailed(true);
                                console.error("-- error:", err);
                        })
                        
                        console.log("end fetch call");
                }
        }

        return (
                <div className="Login">
                {/* Get Access Code modal */}
                        <Modal
                        key={0}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={AcOpen}
                        onHide={handleGetAcClose}
                        >
                                <Modal.Body>
                                        <Form.Group size="lg" controlId={'getAC'} key={1} className="form-contents">
                                        <Form.Label>Business Name</Form.Label>
                                        <Form.Control
                                        autoFocus
                                        type={'text'}
                                        onChange={(e) => setField('getAC', e.target.value)}
                                        isInvalid={!!errors.getAC}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                                {errors.getAC}
                                        </Form.Control.Feedback>
                                        </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={12} style={{textAlign: "center"}}> 
                                                {AcFailed && <Alert severity="error">{failedMessage}</Alert> }
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "60%"}}
                                                className="custom-btn-profile"
                                                onClick={handleGetAC} 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Generate
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "60%"}}
                                                onClick={handleGetAcClose}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                                </Grid>
                                        </Grid>
                                </Modal.Footer>
                        </Modal>
                {/* {logoutError && <Alert severity="error">{failedMessage}</Alert> } */}
                <Form className="LoginForm">
                        <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        wrap="wrap"
                        spacing={0}
                        >
                        {formList.map((item, i) => (
                        constructListItem(item.label, item.error, item.type, item.fieldName, i)
                        ))}
                                <Grid item xs={5} key={"GetAccessCode"}> 
                                        <Button
                                                className="AC-btn"
                                                blocksize="lg"
                                                type="login"
                                                style={{backgroundColor: "#f2ca64", color: "white"}}
                                                onClick={GetAcOpen}
                                                >
                                                Get Access Code
                                        </Button>
                                </Grid>
                        </Grid>
                        {AcSuccess && <Alert severity="info">"The access code was created and sent to your business email."</Alert> }
                        {loginFailed && <Alert severity="error">{failedMessage}</Alert> }
                        <div style={{margin: "0 auto", height: "50px", marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
                        <Button
                        className="login-btn"
                        blocksize="lg"
                        type="login"
                        onClick={handleLogin}
                        style={{margin: "0 auto", backgroundColor: "#f2ca64", color: "white"}}
                        >
                        Login
                        </Button>
                        </div>
                </Form>
                </div>
        );
}