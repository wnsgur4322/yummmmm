/*
App.js
Author: Derek Jeong
Description: App.js is a react root component for rendering all react child hooks.
*/

import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import './App.css';
import Routes from "./Routes";
import { AppContext, CartOpenContext, ItemAddedContext, FailedMessageContext, SelectedMainContext, SelectedItemContext } from "./libs/contextLib";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import wizrds_logo from "./components/assets/wizrds_logo.png";
import logo_red from "./components/assets/logo_red.png";
import header_img from "./components/img/header_img.jpeg";
import Footer from "./customer/containers/Footer";
import { Grid, Button } from '@material-ui/core';

function App() {
	const history = useHistory();
  	const [cartOpen, setCartOpen] = useState(false);
	const [isItemAdded, setIsItemAdded] = useState(false);
	const [isAuthenticated, userHasAuthenticated] = useState(false);
	const [failedMessage, setFailedMessage] = useState(null);

	// shared variables with Menu.js and SelectedItem.js
	const [selectedMain, setSelectedMain] = useState(new Array());
        const [selectedItem, setSelectedItem] = useState(new Array());

	const handleCartOpen = () => {
		setCartOpen(true);
	};

	const handleItemClose = () => {
                setSelectedItem(new Array());
                history.push("/menu");
        }

  	return (
	<div className="App" style={{backgroundColor: window.location.pathname === "/selectedItem" ? "white" : "#FFFBF1"}}>
	<header className="header-area header-sticky color-nav">		
		<Grid
		container
		spacing={0}
		direction="row"
		justifyContent="center"
		alignItems="center"
		style={{width: "100%", margin: "0 auto", maxHeight: "330px", borderBottom: window.location.pathname === "/selectedItem" ? "2px gray solid" : null}}>
			<Grid item xs={2}>
				{window.location.pathname === "/selectedItem" ?                                 
				<Button 
                                size="small" 
                                color="primary"
                                onClick={handleItemClose}
                                >
                                <ArrowBackIcon style={{color: "black"}} /> <p style={{color: "#F2BD2B", margin: "0 auto"}}>Back to the menu </p>
                                </Button> : null}
			</Grid>
			<Grid item xs={8} style={{textAlign: "center"}}>
					<LinkContainer to="/" style={{cursor: "pointer"}} className="logo">
						<img alt="yum" src={logo_red} className="logo"/>
					</LinkContainer>
			</Grid>
			<Grid item xs={2} style={{textAlign: "center"}}>
			</Grid>
		</Grid>
	</header>
		<AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
			<CartOpenContext.Provider value={{ cartOpen, setCartOpen }}>
				<ItemAddedContext.Provider value={{ isItemAdded, setIsItemAdded }}>
					<FailedMessageContext.Provider value={{ failedMessage, setFailedMessage }}>
						<SelectedMainContext.Provider value={{selectedMain, setSelectedMain}}>
							<SelectedItemContext.Provider value={{selectedItem, setSelectedItem}}>
		<Routes />
							</SelectedItemContext.Provider>
						</SelectedMainContext.Provider>
					</FailedMessageContext.Provider>
				</ItemAddedContext.Provider>
			</CartOpenContext.Provider>
		</AppContext.Provider>
		<Footer/>
	</div>

  );
}

export default App;
