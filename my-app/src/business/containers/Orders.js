/*
Orders.js
Author: Derek Jeong
Description: Orders.js is a react hook component for order interfaces for business owner side of the Restaurant App.
This file provides all functions relates with live orders, completed orders, and go on & offline mode.
*/

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, ButtonGroup, Form, Modal, Dropdown, CardColumns } from "react-bootstrap";
import {
        makeStyles, Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography, Card, CardContent, CardMedia, Button, CardActionArea, CardActions,
        Slide, Box, createTheme, ThemeProvider, Divider, ListItem, List, ListItemText
        } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAppContext, useCartOpenContext, useItemAddedContext } from "../../libs/contextLib";
import ListItemButton from '@mui/material/ListItemButton';
import EditIcon from '@material-ui/icons/Edit';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from '@material-ui/icons/Delete';
import burger from "../../components/img/burger/burger.jpg";
import chicken from "../../components/img/sides/chicken.jpg";
import './Orders.css';
import { useStopwatch } from 'react-timer-hook';
import AuthService from "../../services/auth.services";

function Stopwatch() {
        const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        reset,
        } = useStopwatch({ autoStart: true });


        return (
        <span style={{textAlign: 'center'}}>
                <span>{minutes}</span>:<span>{seconds}</span>
        </span>
        );
}

export default function Orders() {
        // logout
        const history = useHistory();
        const { userHasAuthenticated } = useAppContext();
        
        const handleLogout = () => {
                history.push("/business/login");
        }

        // // This function implements logout sequence with button click and fetch call to backend side
        // const handleLogout = () => {
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
        //                         history.push("/business/login");
                                        
        //                 }
        //         })
        //         .catch((err) => {
        //                 console.error("-- error:", err);
        //         })
    
        //         // redirect to login page after logged out
        //         console.log("end fetch call");
        //     }

        // grid size depening on screen size
        const [responsiveXS, setResponsiveXS] = useState(12);
        const [responsiveOptions, setResponsiveOptions] = useState(12);

        const [liveOrders, setLiveOrders] = useState({
                "order#0": [burger, "burger", "Mac & Cheese, Coke", "Extra Cheese please and no fries please"],
                "order#1": [chicken, "chicken", "Salad, Sprite", "N/A"]
        });
        const [renderLiveOrders, setRenderLiveOrders] = useState(new Array());
        const [completedOrders, setCompletedOrders] = useState({
                "order#2": [burger, "cheese burger", "Large Fries, Coke", "no ice for coke"],
                "order#3": [chicken, "buffalo wings", "medium Fries, Coke", "extra buffalo sauce please"]
        });

        // revert completed order to live orders
        const [revertOpen, setRevertOpen] = useState(false);
        const [revertKey, setRevertKey] = useState("");

        const handleRevertOpen = (key) => {
                console.log("revert key:", key);
                setRevertKey(key);
                setRevertOpen(true);
        }

        const handleRevertClose = () => {
                setRevertOpen(false);
        }

        const revertOrderConfirm = () => {
                liveOrders[revertKey] = completedOrders[revertKey];
                console.log(liveOrders, completedOrders[revertKey]);
                delete completedOrders[revertKey];
                console.log(liveOrders, completedOrders);
                setRevertKey("");
                timerOn[revertKey] = false;

                handleRevertClose();
        }

        // go-offline & online modal
        const [offlineOpen, setOfflineOpen] = useState(false);
        const [datePick, setDatePick] = useState(new Date());
        const [offlineNow, setOfflineNow] = useState(false);
        const [isOffline, setIsOffline] = useState(false);
        const [onlineOpen, setOnlineOpen] = useState(false);
        
        const handleGoOfflineOpen = () => {
                setOfflineOpen(true);
        }

        const handleGoOfflineClose = () => {
                setChosenOption("LiveOrders");
                setOfflineOpen(false);
        }

        const goOfflineMode = () => {
                setIsOffline(true);
                handleGoOfflineClose();
        }

        const handleGoOnlineOpen = () => {
                setOnlineOpen(true);
        }

        const handleGoOnlineClose = () => {
                setOnlineOpen(false);
        }

        const goOnlineMode = () => {
                setIsOffline(false);
                handleGoOnlineClose();
        }
        
        // accept order modal
        const [acceptOrderOpen, setAcceptOrderOpen] = useState(false);
        const [completeOpen, setCompleteOpen] = useState(false);
        const [completeKey, setCompleteKey] = useState("");
        const [timerOn, setTimerOn] = useState({});
        const [temp, setTemp] = useState({});

        const handleAcceptOrderOpen = (key) => {
                setAcceptOrderOpen(true);      
        }

        const handleAcceptOrderClose = () => {
                setAcceptOrderOpen(false);
        }

        function handleTimerOnOpen(key) {
                temp[key] = true;
                timerOn[key] = temp[key];
                setTimerOn(temp);
        }
        
        const handleCompleteOpen = (key) => {
                setCompleteKey(key);
                setCompleteOpen(true);
        }

        const handleCompleteClose = () => {
                setCompleteOpen(false);
        }

        const completeConfirm = () => {
                completedOrders[completeKey] = liveOrders[completeKey];
                delete liveOrders[completeKey];
                setCompleteKey("");

                handleCompleteClose();
        }

        // deny order modal
        const [denyOrderOpen, setDenyOrderOpen] = useState(false);
        const [denyOrderKey, setDenyOrderKey] = useState("");

        const handleDenyOrderOpen = (key) => {
                setDenyOrderKey(key);
                setDenyOrderOpen(true);      
        }

        const handleDenyOrderClose = () => {
                setDenyOrderOpen(false);
        }

        const denyOrderConfirm = () => {
                delete liveOrders[denyOrderKey];
                setDenyOrderKey("");
                handleDenyOrderClose(); 
        }

        useEffect(() => {
                console.log(window.innerWidth, window.innerHeight);
                if (window.innerWidth > 760){
                        setResponsiveXS(10);
                        setResponsiveOptions(2);
                };
        }, []);

        // order options
        const [ChosenOption, setChosenOption] = useState("LiveOrders");

        const handleLiveOrdersOpen = () => {
                setChosenOption("LiveOrders");
        };

        const handleCompletedOrdersOpen = () => {
                setChosenOption("CompletedOrders");
        }

        return (
                <div className="Orders">
                        {/* revert completed item modal */}
                        <Modal
                        key={0}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={revertOpen}
                        onHide={handleRevertClose}
                        >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Change back to live orders?
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                        <Card key={revertKey} sx={{ display: 'flex'}}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                        <CardMedia
                                                        component="img"
                                                        image={revertKey !== ""? completedOrders[revertKey][0] : burger}
                                                        alt={"food"}
                                                        className="card-media"
                                                        />
                                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                                                <h5 className="card-title">
                                                                {revertKey !== ""?  completedOrders[revertKey][1] : "N/A"}
                                                                </h5>
                                                                <h5 className="card-para">
                                                                Sides:
                                                                </h5>
                                                                <p className="card-para">
                                                                {revertKey !== ""?  completedOrders[revertKey][2] : "N/A"}
                                                                </p>
                                                                <h5 className="card-para">
                                                                Customer Comments:
                                                                </h5>
                                                                <p className="card-para">
                                                                {revertKey !== ""? completedOrders[revertKey][3] : "N/A"}
                                                                </p>
                                                        </CardContent>
                                                </Box>
                                        </Card>               
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={revertOrderConfirm}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Yes
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={handleRevertClose}
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
                        {/* Go-offline modal*/}
                        <Modal
                        key={1}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={offlineOpen}
                        onHide={handleGoOfflineClose}
                        >
                                <Modal.Header closeButton style={{backgroundColor: "#f7f7f7"}}>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Set your offline hours
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{backgroundColor: "#f7f7f7"}}>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={5} key={"startDate"}>                               
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>Start date</Form.Label>
                                                <DatePicker
                                                disabled={offlineNow}
                                                className="form-control"
                                                selected={datePick}
                                                onSelect={(date) => setDatePick(date)} //when day is clicked
                                                onChange={(date) => setDatePick(date)} //only when value has changed
                                                />
                                                </Form.Group>
                                                </Grid>
                                                <Grid item xs={5} key={"startTime"}>                               
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>Start time</Form.Label>
                                                <DatePicker
                                                disabled={offlineNow}
                                                className="form-control"
                                                selected={datePick}
                                                onChange={(time) => setDatePick(time)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                />
                                                </Form.Group>
                                                </Grid>
                                                <Grid item xs={5} key={"endDate"}>                               
                                                <Form.Group
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>End date</Form.Label>
                                                <DatePicker
                                                disabled={offlineNow}
                                                className="form-control"
                                                selected={datePick}
                                                onSelect={(date) => setDatePick(date)} //when day is clicked
                                                onChange={(date) => setDatePick(date)} //only when value has changed
                                                />
                                                </Form.Group>
                                                </Grid>
                                                <Grid item xs={5} key={"endTime"}>                               
                                                <Form.Group 
                                                className="formBox-date" 
                                                size="md" 
                                                controlId="inputDate" 
                                                >
                                                <Form.Label>End time</Form.Label>
                                                <DatePicker
                                                disabled={offlineNow}
                                                className="form-control"
                                                selected={datePick}
                                                onChange={(time) => setDatePick(time)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                />
                                                </Form.Group>
                                                </Grid>
                                        </Grid>
                                        <div style={{margin: "0 auto", height: "30px", textAlign: "center"}}>
                                        <FormControlLabel
                                        value="end"
                                        control={<Checkbox
                                                checked={offlineNow}
                                                // disabled={deliveryChecked}
                                                onChange={(event) => setOfflineNow(event.target.checked)}
                                                />}
                                        label="Go offline now"
                                        labelPlacement="end"
                                        />
                                        </div>

                                </Modal.Body>
                                <Modal.Footer style={{backgroundColor: "#f7f7f7"}}>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={goOfflineMode}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Done
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={handleGoOfflineClose}
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
                        {/* go-online modal */}
                        <Modal
                        key={2}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={onlineOpen}
                        onHide={handleGoOnlineClose}
                        >
                                <Modal.Body style={{backgroundColor: "#f7f7f7"}}>
                                        <h5 style={{textAlign: "center"}}>
                                                Go back Online?  
                                        </h5>
                                </Modal.Body>
                                <Modal.Footer style={{backgroundColor: "#f7f7f7"}}>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={goOnlineMode}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Yes
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={handleGoOnlineClose}
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
                        {/* accept complete order modal */}
                        <Modal
                        key={3}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={completeOpen}
                        onHide={handleCompleteClose}
                        >
                                <Modal.Body style={{backgroundColor: "#f7f7f7"}}>
                                        <h5 style={{textAlign: "center"}}>
                                                Are you sure want to complete this order?    
                                        </h5>
                                        <Card key={completeKey} sx={{ display: 'flex'}}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                        <CardMedia
                                                        component="img"
                                                        image={completeKey !== ""? liveOrders[completeKey][0] : burger}
                                                        alt={"food"}
                                                        className="card-media"
                                                        />
                                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                                                <h5 className="card-title">
                                                                {completeKey !== ""?  liveOrders[completeKey][1] : "N/A"}
                                                                </h5>
                                                                <h5 className="card-para">
                                                                Sides:
                                                                </h5>
                                                                <p className="card-para">
                                                                {completeKey !== ""?  liveOrders[completeKey][2] : "N/A"}
                                                                </p>
                                                                <h5 className="card-para">
                                                                Customer Comments:
                                                                </h5>
                                                                <p className="card-para">
                                                                {completeKey !== ""? liveOrders[completeKey][3] : "N/A"}
                                                                </p>
                                                        </CardContent>
                                                </Box>
                                        </Card>
                                </Modal.Body>
                                <Modal.Footer className="two-button" style={{backgroundColor: "#f7f7f7"}}>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={completeConfirm}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Yes
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={handleCompleteClose}
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
                        {/* deny order modal */}
                        <Modal
                        key={4}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={denyOrderOpen}
                        onHide={handleDenyOrderClose}
                        >
                                <Modal.Body style={{backgroundColor: "#f7f7f7"}}>
                                        <h5 style={{textAlign: "center"}}>
                                                Please state the reason of denying this order    
                                        </h5>
                                        <Form.Group 
                                        className="formBox-single" 
                                        size="md" 
                                        controlId="role" 
                                        >
                                        <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Leave a comment here"
                                        />
                                </Form.Group>

                                </Modal.Body>
                                <Modal.Footer style={{backgroundColor: "#f7f7f7"}}>
                                        <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center"
                                        wrap="wrap"
                                        spacing={2}
                                        >
                                                <Grid item xs={6} style={{textAlign: "center"}}>   
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={denyOrderConfirm}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Send
                                                </Button>
                                                </Grid>
                                                <Grid item xs={6} style={{textAlign: "center"}}>  
                                                <Button
                                                style={{backgroundColor: "#f2ca64", color: "white", width: "45%"}}
                                                onClick={handleDenyOrderClose}
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
                        <Grid
                        key={5} 
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        style={{width: "100%", margin: "0 auto"}}>
                                <Grid item xs={responsiveOptions} style={{textAlign: "center", backgroundColor: "grey"}}>
                                        <List style={{color: "white"}}>
                                                <ListItem className="ListMenu" style={{padding: "0", margin: "10px 0 10px"}}>
                                                <ListItemButton onClick={handleLiveOrdersOpen}>
                                                <p className="menu-title">LIVE ORDERS</p>
                                                </ListItemButton>
                                                </ListItem>
                                                <ListItem className="ListMenu" style={{padding: "0", margin: "10px 0 10px"}}>
                                                <ListItemButton onClick={handleCompletedOrdersOpen}>
                                                <p className="menu-title">COMPLETED ORDERS</p>
                                                </ListItemButton>
                                                </ListItem>
                                                <ListItem className="ListMenu" style={{padding: "0", margin: "10px 0 10px"}}>
                                                {!isOffline?  
                                                <ListItemButton onClick={handleGoOfflineOpen}>
                                                <p className="menu-title" style={{textAlign: "center", marginRight: "5px"}}>GO</p>
                                                <p className="offline-title" style={{textAlign: "center", color: "red"}}>OFFLINE</p>
                                                </ListItemButton> :
                                                <ListItemButton onClick={handleGoOnlineOpen}>
                                                <p className="menu-title" style={{textAlign: "center", marginRight: "5px"}}>GO</p>
                                                <p className="offline-title" style={{textAlign: "center", color: "greenyellow"}}>ONLINE</p>
                                                </ListItemButton>
                                                }
                                                </ListItem>
                                                {isOffline && <Alert severity="warning" style={{marginTop: "10px"}}>{
                                                        "Offline mode is activated, new order will not appear on 'LIVE ORDERS' section."
                                                }</Alert> }
                                                <ListItem className="ListMenu" style={{padding: "0", margin: "10px 0 10px"}}>
                                                <ListItemButton onClick={handleLogout}>
                                                <p className="menu-title" style={{textAlign: "center"}}>Log Out <ExitToAppIcon/></p>
                                                </ListItemButton>
                                                </ListItem>
                                                
                                        </List>
                                </Grid>
                                <Grid item xs={responsiveXS} style={{textAlign: "center", display: ChosenOption === "LiveOrders"? "block" : "none"}}>
                                        {Object.entries(liveOrders).map(([key, value]) => (
                                                <Card key={key} sx={{ display: 'flex'}}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                                <CardMedia
                                                                component="img"
                                                                image={value[0]}
                                                                alt={"food"}
                                                                className="card-media"
                                                                />
                                                                <CardContent sx={{ flex: '1 0 auto' }}>
                                                                        <h5 className="card-title">
                                                                        {value[1]}
                                                                        </h5>
                                                                        <h5 className="card-para">
                                                                        Sides:
                                                                        </h5>
                                                                        <p className="card-para">
                                                                                {value[2]}
                                                                        </p>
                                                                        <h5 className="card-para">
                                                                        Customer Comments:
                                                                        </h5>
                                                                        <p className="card-para">
                                                                                {value[3]}
                                                                        </p>
                                                                </CardContent>
                                                                {timerOn[key]?
                                                                (
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}} style={{margin: "0 auto", width: "15%"}}>
                                                                <Button
                                                                disabled
                                                                id={"All"}
                                                                aria-label="Menu"
                                                                onClick={() => console.log("onclicked")}
                                                                style={{backgroundColor: "grey", marginBottom: "20px"}}
                                                                type="add"
                                                                >
                                                                        <p className="card-title" style={{margin: "0", color: "white"}}>
                                                                                <Stopwatch />
                                                                        </p>
                                                                </Button>
                                                                <Button
                                                                id={"All"}
                                                                edge="end"
                                                                aria-label="Menu"
                                                                onClick={() => handleCompleteOpen(key)}
                                                                style={{backgroundColor: "greenyellow"}}
                                                                type="add"
                                                                >
                                                                        <p className="card-title" style={{margin: "0", color: "white"}}>
                                                                        Complete
                                                                        </p>
                                                                </Button>
                                                                </Box>
                                                                )
                                                                :
                                                                (
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}} style={{margin: "0 auto", width: "15%"}}>
                                                                <Button
                                                                id={"All"}
                                                                aria-label="Menu"
                                                                onClick={() => handleTimerOnOpen(key)}
                                                                style={{backgroundColor: "#36cf3d", marginBottom: "20px"}}
                                                                type="add"
                                                                >
                                                                        <p className="card-title" style={{margin: "0", color: "white"}}>
                                                                        Accept Order
                                                                        </p>
                                                                </Button>
                                                                <Button
                                                                id={"All"}
                                                                edge="end"
                                                                aria-label="Menu"
                                                                onClick={() => handleDenyOrderOpen(key)}
                                                                style={{backgroundColor: "#b43f3f"}}
                                                                type="add"
                                                                >
                                                                        <p className="card-title" style={{margin: "0", color: "white"}}>
                                                                        Deny Order
                                                                        </p>
                                                                </Button>
                                                                </Box>
                                                                )
                                                                }
                                                        </Box>
                                                </Card>
                                        ))}
                                        </Grid>
                                        <Grid item xs={responsiveXS} style={{textAlign: "center", display: ChosenOption === "CompletedOrders"? "block" : "none"}}>
                                        {Object.entries(completedOrders).map(([key, value]) => (
                                                <Card key={key} sx={{ display: 'flex'}}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                                <CardMedia
                                                                component="img"
                                                                image={value[0]}
                                                                alt={"food"}
                                                                className="card-media"
                                                                />
                                                                <CardContent sx={{ flex: '1 0 auto' }}>
                                                                        <h5 className="card-title">
                                                                                {value[1]}
                                                                        </h5>
                                                                        <h5 className="card-para">
                                                                        Sides:
                                                                        </h5>
                                                                        <p className="card-para">
                                                                                {value[2]}
                                                                        </p>
                                                                        <h5 className="card-para">
                                                                        Customer Comments:
                                                                        </h5>
                                                                        <p className="card-para">
                                                                                {value[3]}
                                                                        </p>
                                                                </CardContent>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                                        <h5 className="Completed">
                                                                                {"COMPLETED"}
                                                                        </h5>
                                                                        <IconButton
                                                                        id={"All"}
                                                                        edge="end"
                                                                        aria-label="Menu"
                                                                        onClick={()=> handleRevertOpen(key)}
                                                                        style={{margin: "0 auto"}}
                                                                        type="add"
                                                                        >
                                                                                <EditIcon/>
                                                                        </IconButton>
                                                                </Box>
                                                        </Box>
                                                </Card>
                                        ))}
                                </Grid>
                        </Grid>

                </div>
        );
}