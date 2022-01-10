/*
Footer.js
Author: Derek Jeong
Description: Footer.js is a react hook component for rendering the footer part on all pages of the Restuarant App.
*/

import React, { useState, useEffect } from "react";
import wizrds_logo from "../../components/assets/wizrds_logo.png";
import FacebookIcon from '@material-ui/icons/Facebook';
import Twitter from '@material-ui/icons/Twitter';
import Linkedin from '@material-ui/icons/LinkedIn';
import { Col, Row, Container, ButtonGroup, Form, Modal, Dropdown } from "react-bootstrap";
import {
        List, ListItemAvatar, ListItem, 
        ListItemText, ListItemSecondaryAction, ListItemIcon,
        Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography, Card, CardContent, CardMedia, Button, CardActionArea, CardActions
        } from '@material-ui/core';
import "./Footer.css";


export default function Footer() {

        return (
		<div className="footer" style={{marginTop: "5%"}}>
                        <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{width: "100%", margin: "0 auto"}}>
                                <Grid item xs={2} className="logo-align">
                                        <img className="logo" src={wizrds_logo} alt="logo" style={{width: window.innerWidth > 760 ? "40%" : "100%"}}/>
                                </Grid>
                                <Grid item xs={2} className="para" style={{color: "white"}}>
                                        <p>Copyright &copy; 2021 Wizrds LLC.</p>
                                        <p>A Mister Waverly Company</p>
                                </Grid>
                                <Grid item xs={6} className="Follow-us" style={{margin: "0 auto", marginTop: "10px"}}>
                                        <p>FOLLOW US</p>
                                </Grid>
                                <Grid item xs={2}>
                                        <ul className="social-icons">                                   
                                                        <IconButton
                                                        edge="end"
                                                        aria-label="Menu"
                                                        onClick={() => window.open("https://www.facebook.com/webwizrds", "_blank")}
                                                        style={{margin: "0 auto"}}
                                                        type="add"
                                                        >
                                                        <FacebookIcon className="social-icons"/>
                                                        </IconButton>                                    
                                                        <IconButton
                                                        edge="end"
                                                        aria-label="Menu"
                                                        onClick={() => window.open("https://twitter.com/WebWizrds", "_blank")}
                                                        style={{margin: "0 auto"}}
                                                        type="add"
                                                        >
                                                        <Twitter className="social-icons"/>
                                                        </IconButton>                                       
                                                        <IconButton
                                                        edge="end"
                                                        aria-label="Menu"
                                                        onClick={() => window.open("https://www.linkedin.com/company/wizrds-llc", "_blank")}
                                                        style={{margin: "0 auto"}}
                                                        type="add"
                                                        >
                                                        <Linkedin className="social-icons"/>
                                                        </IconButton>
                                        </ul>
                                </Grid>
                        </Grid>
                </div>
        );

}