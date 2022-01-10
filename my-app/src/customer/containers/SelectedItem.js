/*
SelectedItem.js
Author: Derek Jeong
Description: SelectedItem.js is a react hook component for rendering /selectedItem page for customer side.
This page let users make speficiation on selected item from menu page.
*/

import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, Form, Modal, Dropdown, CardColumns } from "react-bootstrap";
import {
        makeStyles, Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography, Card, CardContent, CardMedia, Button, CardActionArea, CardActions,
        Slide, Box, createTheme, ThemeProvider, Divider, Paper, TextField, ButtonGroup
        } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';
import Carousel from 'react-material-ui-carousel';
import {Link} from 'react-scroll';
import { useSelectedMainContext, useSelectedItemContext } from "../../libs/contextLib";
import './SelectedItem.css';

// images (only for test and demo)

// burger
import burger from "../../components/img/burger/burger.jpg";
import baconCheese from "../../components/img/burger/baconCheese.png";
import flamethrower from "../../components/img/burger/flamethrower.png";
import roastBeef from "../../components/img/burger/roastBeef.jpg";

// chicken sandwich
import chickenS from "../../components/img/chickenSandwich/chickenS.jpg";
import crispyCS from "../../components/img/chickenSandwich/crispyChicken.jpg";
import longCS from "../../components/img/chickenSandwich/longCS.jpg";
import spicyCS from "../../components/img/chickenSandwich/spicyCS.jpg";

// drink
import zero_coke from "../../components/img/drink/zero_coke.jpeg";
import sprite from "../../components/img/drink/sprite.jpeg";
import milkTea from "../../components/img/drink/milkTea.jpeg";
import MD from "../../components/img/drink/MD.png";
import CM from "../../components/img/drink/chocolateM.jpg";

// sides
import chicken from "../../components/img/sides/chicken.jpg";
import salad from "../../components/img/sides/salad.jpg";
import fries from "../../components/img/sides/frenchFries.jpg";
import nuggets from "../../components/img/sides/nuggets.jpg";

// ads
import salad_ad from "../../components/img/salad_ad.png";
import burger_ad from "../../components/img/burger_ad.png";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FaShoppingCart } from "react-icons/fa";
import Carousel2 from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { border } from "@mui/system";

export default function SelectedItem() {
        const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
        const history = useHistory();

        // menu item format: [image file, calories, description, price]
        const [mostPopularList, setMostPopularList] = useState({
                "cheese burger": [burger_ad, "250 Cal.", "Classic cheese burger with slice cheddar cheese", 3.56], 
                "flamethrower burger": [flamethrower, "450 Cal.", "100% beef burger patties topped with FlameThrower sauce, melted pepper jack", 4.99], 
                "roast chicken": [chicken, "650 Cal.", "oven roasted chicken with special dipping sauces", 4.25],
                "milk tea": [milkTea, "180 Cal.", "sweet milk tea with classic black boba", 2.50]
        });
        const [burgerList, setBurgerList] = useState({
                "cheese burger": [burger_ad, "250 Cal.", "Classic cheese burger with slice cheddar cheese", 3.56],
                "bacon cheese": [baconCheese, "435 Cal.", "Classic bacon cheese burger with slice cheddar cheese and fresh tomato slice", 4.20],
                "flamethrower burger": [flamethrower, "450 Cal.", "100% beef burger patties topped with FlameThrower sauce, melted pepper jack ", 4.99], 
                "roastbeef burger": [roastBeef, "350 Cal.", "Classic burger with 100% roast beef", 5.19],
        });
        const [chickenSList, setChickenSList] = useState({
                "chicken sandwich": [chickenS, "350 Cal.", "Classic chicken sandwich with fresh lettuce", 2.50],
                "cripsy chicken sandwich": [crispyCS, "390 Cal.", "very crsipy chicken sandwich with deep fried chicken patty", 4.19],
                "long chicken sandwich": [longCS, "550 Cal.", "Classic chicken sandwich with fresh lettuce and special sauce", 5.50], 
                "spicy chicken sandwich": [roastBeef, "400 Cal.", "spicy chicken sandwich with deep fried chicken patty", 4.29],
        });
        const [drinkList, setDrinkList] = useState({
                "zero coke": [zero_coke, "0 Cal.", "zero calories from Coca Cola", 1.56],
                "sprite": [sprite, "120 Cal.", "lime lemon flavor soft drink from Coca Cola", 1.56],
                "milk tea": [milkTea, "180 Cal.", "sweet milk tea with classic black boba", 1.56],
                "mountain dew": [MD, "150 Cal.", "classic soft drink from Pepsi Co.", 1.56],
                "chocolate milk": [CM, "140 Cal.", "100% chocolate !", 2.50]

        });
        const [sideList, setSideList] = useState({
                "roast chicken": [chicken, "650 Cal.", "oven roasted chicken with special dipping sauces", 4.25],
                "salad": [salad, "90 Cal.", "fresh organic salad with dressing", 3.19],
                "french fries": [fries, "160 Cal.", "Classic french fries with salt", 1.99],
                "chicken nuggets": [nuggets, "260 Cal.", "Crispy chicken nuggets with 100% chicken", 3.00]
        });

        useEffect(() => {
                if(sides.length < 1) {
                        Object.entries(burgerList).map(([key, value]) => {
                                burgers.push(
                                        <Button
                                        className="Itembutton"
                                        onClick={event => handleSelectedSide(event, key, value[1], value[3])}
                                        key={key}
                                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                backgroundColor: "#f7f7f7", textTransform: "none", padding: "0",
                                                display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%",
                                                }}>
                                                <CardMedia
                                                component="img"
                                                image={value[0]}
                                                alt={"ad"}
                                                style={{margin: "0 auto", opacity: isSelectedSide === true ? 0.7 : 1 }}
                                                height="250"
                                                />
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <h2 className="selectedItem-titles" style={{color: "black", paddingTop: "10px", paddingLeft: "8px"}}>{key}</h2>
                                                <p style={{paddingTop: "10px", paddingRight: "8px"}}>{value[1]}</p>
                                                </div>
                                                <div
                                                style={{ position:"relative", bottom: 0}}>
                                                <CardActions>
                                                        <Typography size="small" color="textPrimary">
                                                        $ {value[3]}
                                                        </Typography>
                                                </CardActions>
                                                </div>
                                        </Button>
                                )
                        });
                        Object.entries(chickenSList).map(([key, value]) => {
                                burgers.push(
                                        <Button
                                        className="Itembutton"
                                        onClick={event => handleSelectedSide(event, key, value[1], value[3])}
                                        key={key}
                                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                backgroundColor: "#f7f7f7", textTransform: "none", padding: "0",
                                                display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%",
                                                }}>
                                                <CardMedia
                                                component="img"
                                                image={value[0]}
                                                alt={"ad"}
                                                style={{margin: "0 auto", opacity: isSelectedSide === true ? 0.7 : 1 }}
                                                height="250"
                                                />
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <h2 className="selectedItem-titles" style={{color: "black", paddingTop: "10px", paddingLeft: "8px"}}>{key}</h2>
                                                <p style={{paddingTop: "10px", paddingRight: "8px"}}>{value[1]}</p>
                                                </div>
                                                <div
                                                style={{ position:"relative", bottom: 0}}>
                                                <CardActions>
                                                        <Typography size="small" color="textPrimary">
                                                        $ {value[3]}
                                                        </Typography>
                                                </CardActions>
                                                </div>
                                        </Button>
                                )
                        });
                        Object.entries(sideList).map(([key, value]) => {
                                sides[0].push(
                                        <Button
                                        className="Itembutton"
                                        onClick={event => handleSelectedSide(event, key, value[1], value[3])}
                                        key={key}
                                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                backgroundColor: "#f7f7f7", textTransform: "none", padding: "0",
                                                display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%",
                                                }}>
                                                <CardMedia
                                                component="img"
                                                image={value[0]}
                                                alt={"ad"}
                                                style={{margin: "0 auto", opacity: isSelectedSide === true ? 0.7 : 1 }}
                                                height="250"
                                                />
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <h2 className="selectedItem-titles" style={{color: "black", paddingTop: "10px", paddingLeft: "8px"}}>{key}</h2>
                                                <p style={{paddingTop: "10px", paddingRight: "8px"}}>{value[1]}</p>
                                                </div>
                                                <div
                                                style={{ position:"relative", bottom: 0}}>
                                                <CardActions>
                                                        <Typography size="small" color="textPrimary">
                                                        $ {value[3]}
                                                        </Typography>
                                                </CardActions>
                                                </div>
                                        </Button>
                                )
                        });
                        Object.entries(drinkList).map(([key, value]) => {
                                drinks.push(
                                        <Button
                                        onClick={event => handleSelectedDrink(event, key, value[1], value[3])}
                                        key={key}
                                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                backgroundColor: "#f7f7f7", textTransform: "none", padding: "0", position: "relative",
                                                display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%"}}
                                        className="Itembutton"
                                        >
                                                <CardMedia
                                                component="img"
                                                image={value[0]}
                                                alt={"ad"}
                                                style={{margin: "0 auto", objectFit: "cover", overflow: "hidden", opacity: isSelectedDrink === true ? 0.7 : 1 }}
                                                height="250"
                                                />
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <h2 className="selectedItem-titles" style={{color: "black", paddingTop: "10px", paddingLeft: "8px"}}>{key}</h2>
                                                <p style={{paddingTop: "10px", paddingRight: "8px"}}>{value[1]}</p>
                                                </div>
                                                <div
                                                style={{ position:"relative", bottom: 0}}>
                                                <CardActions>
                                                        <Typography size="small" color="textPrimary">
                                                        $ {value[3]}
                                                        </Typography>
                                                </CardActions>
                                                </div>
                                        </Button>
                                )
                        });
                }
                console.log("burgers", sides);

        }, []);

        // item carousels
        const responsive = {
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 1,
                  slidesToSlide: 1, // optional, default to 1.
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 1,
                  slidesToSlide: 1, // optional, default to 1.
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                  slidesToSlide: 1, // optional, default to 1.
                }
        };

        // shared variables with Menu.js
        const {selectedMain, setSelectedMain} = useSelectedMainContext();
        const {selectedItem, setSelectedItem} = useSelectedItemContext();


        const handleSelecteditem = (event, key, calories, price) => {
                event.preventDefault();
        }

        // variables for button group to increase/decrease item counter
        const [mainCounter, setMainCounter] = useState([0]);
        const [sideCounter, setSideCounter] = useState([0]);
        const [drinkCounter, setDrinkCounter] = useState([0]);

        // add a side & drink
        const [addSide, setAddSide] = useState(false);
        const [sides, setSides] = useState(new Array(4).fill([]));
        const [selectedSide, setSelectedSide] = useState(new Array());
        const [isSelectedSide, setIsSelectedSide] = useState(false);
        const [addDrink, setAddDrink] = useState(false);
        const [drinks, setDrinks] = useState(new Array());
        const [selectedDrink, setSelectedDrink] = useState(new Array());
        const [isSelectedDrink, setIsSelectedDrink] = useState(false);
        const [clickedSection, setClickedSection] = useState(String);

        const handleClickedSection = (event, i) => {
                event.preventDefault();
                setClickedSection("section" + i);
                console.log("section clicked:", clickedSection);
                forceUpdate();
        }

        // get total price
        const [totalPrice, setTotalPrice] = useState({main: [], side: [], drink: [] });
        const [sumPrices, setSumPrices] = useState(0);

        const handleSelectedSide = (event, key, calories, price) => {
                event.preventDefault();
                setIsSelectedSide(true);
                selectedSide.push([key, calories, price]);
                if (selectedSide.length >= 2){
                        selectedSide.shift();
                }

                // fix here to reflect clicked section useState 12/14
                setSectioninfo(sectioninfo => ({
                        ...sectioninfo,
                        [clickedSection] : [key, calories, price]

                })
                );

                // sectioninfo[clickedSection] = [key, calories, price];

                if (sideCounter[sectionCounter] === 0){
                        console.log(sideCounter);
                        totalPrice["side"].push(price * 1);
                } 
                else{
                        console.log(sideCounter);
                        totalPrice["side"].push(price * sideCounter[sectionCounter]);
                }
                // const total = totalPrice["side"].reduce((prev, cur) => prev + cur, 0);
                // setSumPrices(total);
                console.log(totalPrice);
        }

        const handleAddSide = () => {
                setAddSide(true);
        }

        const handleAddDrink = () => {
                setAddDrink(true);
        }

        const handleSelectedDrink = (event, key, calories, price) => {
                event.preventDefault();
                console.log(key);
                selectedDrink.push([key, calories, price]);
                if (selectedDrink.length >= 2){
                        selectedDrink.shift();
                }
                setIsSelectedDrink(true);
                if (drinkCounter[sectionCounter] < 1){
                        totalPrice["drink"].push(price * 1);
                } else{
                        totalPrice["drink"].push(price * drinkCounter[sectionCounter]);
                }
                console.log(totalPrice);
                console.log(selectedDrink);
        }

        // add a section variables & functions
        const [burgers, setBurgers] = useState(new Array([]));
        const [sectionWidth, setSectionWidth] = useState(10);
        const [gridWidth, setGridWidth] = useState("50%");
        const [itemArrows, setItemArrows] = useState(true);
        const [sections, setSections] = useState(new Array());
        const [addEntree, setAddEntree] = useState(new Array(false));
        const [addSectionSide, setAddSectionSide] = useState(new Array(false));
        const [addSectionDrink, setAddSectionDrink] = useState(new Array(false));
        const [sectionCounter, setSectionCounter] = useState(0);
        const [sectioninfo, setSectioninfo] = useState({"section0": []});

        const handleAddEntree = (sectionKey) => {
                let temp = addEntree;
                temp[sectionKey] = true;
                setAddEntree(temp);
                forceUpdate();
        }

        const handleAddSideSection = (sectionKey) => {
                console.log(sectionKey);
                let temp = addSectionSide;
                temp[sectionKey] = true;
                setAddSectionSide(temp);
                console.log(sectionKey, addSectionSide);
                forceUpdate();
                
        }

        const handleAddDrinkSection = (sectionKey) => {
                console.log(sectionKey);
                let temp = addSectionDrink;
                temp[sectionKey] = true;
                setAddSectionDrink(temp);
                console.log(sectionKey, addSectionDrink);
                forceUpdate();
        }

        const handleAddSection = () => {
                let tempCounter = sectionCounter + 1;
                setSectionCounter(tempCounter);
                console.log(sectionCounter);

                // add every section array to summarize an order
                sectioninfo["section" + tempCounter] = [];
                console.log("section: ", sectioninfo);

                setAddEntree([...addEntree, false]);
                setAddSectionSide([...addSectionSide, false]);
                console.log("AddSectionSide:", addSectionSide);
                setAddSectionDrink([...addSectionDrink, false]);

                setSectionWidth(4);
                setItemArrows(false);
                setGridWidth("100%");

                mainCounter.push(0);
                sideCounter.push(0);
                drinkCounter.push(0);
                console.log(mainCounter);

                sections.push(tempCounter);
        }

        return (
                <div className="selectedItem">
                        {/* add a section button */}
                        {sectionCounter < 1 && 
                                <Button
                                onClick={handleAddSection}
                                key={"addSection"} 
                                style={{textTransform: "none", color: "#F2BD2B",
                                        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                        margin: "0 auto", marginBottom: "40px", width: window.innerWidth > 760 ? "20%" : "30%", 
                                        display: "block", height: "100%", textAlign: "center"}}
                                >
                                <div style={{margin: "0 auto"}}>
                                <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a section</h2>
                                <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                </div>
                                </Button>
                        }
                        {/* section girds */}
                                <Grid
                                key={"section" + 0} 
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                style={{width: window.innerWidth > 760 ? gridWidth : "100%", margin: "0 auto"}}
                                onClick={(event) => handleClickedSection(event, 0)}
                                >
                                        {/* selected item box */}
                                        <Grid item xs={sectionWidth} style={{textAlign: "center", marginBottom: "40px"}}>
                                        <div>
                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                        {<Button onClick={() => {mainCounter[0] = mainCounter[0] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                        {(mainCounter[0] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{mainCounter[0]}</Button>}
                                        {(mainCounter[0] > 0) && <Button onClick={() => {mainCounter[0] = mainCounter[0] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}                                         
                                        </ButtonGroup>
                                        <Carousel2
                                        focusOnSelect={true}
                                        swipeable={true}
                                        draggable={true}
                                        showDots={false}
                                        responsive={responsive}
                                        ssr={true} // means to render carousel on server-side.
                                        arrows={itemArrows} 
                                        renderButtonGroupOutside={true}
                                        infinite={true}
                                        autoPlay={false}
                                        keyBoardControl={true}
                                        customTransition="all .5"
                                        transitionDuration={500}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        dotListClass="custom-dot-list-style"
                                        itemClass="carousel-item-padding-20-px"
                                        className="Itemcarousels"
                                        >
                                                {selectedItem.map((component) => (component))}
                                        </Carousel2>
                                        </div>
                                        </Grid>

                                        {/* Add a side button */}
                                        <Grid item xs={sectionWidth} style={{textAlign: "center", marginBottom: "40px"}}>
                                        {addSide === true ?
                                        <div>
                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                        {<Button onClick={() => {sideCounter[0] = sideCounter[0] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                        {(sideCounter[0] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{sideCounter[0]}</Button>}
                                        {(sideCounter[0] > 0) && <Button onClick={() => {sideCounter[0] = sideCounter[0] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}
                                        </ButtonGroup>
                                        <Carousel2
                                        focusOnSelect={true}
                                        swipeable={true}
                                        draggable={true}
                                        showDots={false}
                                        responsive={responsive}
                                        arrows={itemArrows} 
                                        renderButtonGroupOutside={true}
                                        ssr={true} // means to render carousel on server-side.
                                        infinite={true}
                                        autoPlay={false}
                                        keyBoardControl={true}
                                        customTransition="all .5"
                                        transitionDuration={500}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        dotListClass="custom-dot-list-style"
                                        itemClass="carousel-item-padding-20-px"
                                        className="Itemcarousels"
                                        >
                                                {sides[0].map((component) => (component))}
                                        </Carousel2>
                                        </div> :
                                        <Button
                                        onClick={handleAddSide}
                                        key={"addSide"}
                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                        margin: "0 auto", marginBottom: "60px", textTransform: "none", color: "#F2BD2B",
                                        width: window.innerWidth > 760 ? "49%" : "39%", 
                                        display: "block", height: "100%", textAlign: "center"}}>
                                        <div
                                        style={{margin: "0 auto"}}>
                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a side</h2>
                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                        </div>
                                        </Button>
                                        }
                                        </Grid>

                                        {/* Add a drink button */}
                                        <Grid item xs={sectionWidth} style={{textAlign: "center", marginBottom: "40px"}}>
                                        {addDrink === true ?
                                        <div>
                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                        {<Button onClick={() => {drinkCounter[0] = drinkCounter[0] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                        {(drinkCounter[0] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{drinkCounter[0]}</Button>}
                                        {(drinkCounter[0] > 0) && <Button onClick={() => {drinkCounter[0] = drinkCounter[0] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}                                         
                                        </ButtonGroup>
                                        <Carousel2
                                        focusOnSelect={true}
                                        swipeable={true}
                                        draggable={true}
                                        showDots={false}
                                        responsive={responsive}
                                        ssr={true} // means to render carousel on server-side.
                                        arrows={itemArrows} 
                                        renderButtonGroupOutside={true}
                                        infinite={true}
                                        autoPlay={false}
                                        keyBoardControl={true}
                                        customTransition="all .5"
                                        transitionDuration={500}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        dotListClass="custom-dot-list-style"
                                        itemClass="carousel-item-padding-20-px"
                                        className="Itemcarousels"
                                        >
                                                {drinks.map((component) => (component))}
                                        </Carousel2>
                                        </div> :
                                        <Button
                                        onClick={handleAddDrink}
                                        key={"addDrink"}
                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                margin: "0 auto", marginBottom: "60px", textTransform: "none", color: "#F2BD2B",
                                                width: window.innerWidth > 760 ? "49%" : "39%", 
                                                display: "block", height: "100%", textAlign: "center"}}>
                                        <div
                                        style={{margin: "0 auto"}}>
                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a drink</h2>
                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                        </div>
                                        </Button>
                                        }
                                        </Grid>
                                </Grid>

                                {/* additional sections */}
                                {sections.map((i) => {
                                        return (
                                                <Grid
                                                key={"section" + i} 
                                                container
                                                spacing={2}
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="center"
                                                style={{width: "100%", margin: "0 auto"}}
                                                onClick={(event) => handleClickedSection(event, i)}
                                                >
                                                        {/* Add an entry button */}
                                                        <Grid item xs={4} style={{textAlign: "center", marginBottom: "40px"}}>
                                                        {addEntree[i] &&
                                                        <div key={"sectionE" + i}>
                                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                                        {<Button onClick={() => {mainCounter[i] = mainCounter[i] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                                        {(mainCounter[i] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{mainCounter[i]}</Button>}
                                                        {(mainCounter[i] > 0) && <Button onClick={() => {mainCounter[i] = mainCounter[i] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}                                         
                                                        </ButtonGroup>
                                                        <Carousel2
                                                        focusOnSelect={true}
                                                        swipeable={true}
                                                        draggable={true}
                                                        showDots={false}
                                                        responsive={responsive}
                                                        ssr={true} // means to render carousel on server-side.
                                                        arrows={false} 
                                                        renderButtonGroupOutside={true}
                                                        infinite={true}
                                                        autoPlay={false}
                                                        keyBoardControl={true}
                                                        customTransition="all .5"
                                                        transitionDuration={500}
                                                        containerClass="carousel-container"
                                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                                        dotListClass="custom-dot-list-style"
                                                        itemClass="carousel-item-padding-20-px"
                                                        className="Itemcarousels"
                                                        >
                                                                {burgers.map((component) => (component))}
                                                        </Carousel2>
                                                        </div>}
                                                        {!addEntree[i] &&
                                                        <Button
                                                        onClick={() => handleAddEntree(i)}
                                                        key={"addDrink" + i}
                                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                                margin: "0 auto", marginBottom: "60px", textTransform: "none", color: "#F2BD2B",
                                                                width: window.innerWidth > 760 ? "49%" : "39%", 
                                                                display: "block", height: "100%", textAlign: "center"}}>
                                                        <div
                                                        style={{margin: "0 auto"}}>
                                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add an entree</h2>
                                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                                        </div>
                                                        </Button>
                                                        }
                                                        </Grid>
                        
                                                        {/* Add a side button */}
                                                        <Grid item xs={4} style={{textAlign: "center", marginBottom: "40px"}}>
                                                        {addSectionSide[i] && 
                                                        <div key={"sectionS" + i}>
                                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                                        {<Button onClick={() => {sideCounter[i] = sideCounter[i] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                                        {(sideCounter[i] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{sideCounter[i]}</Button>}
                                                        {(sideCounter[i] > 0) && <Button onClick={() => {sideCounter[i] = sideCounter[i] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}
                                                        </ButtonGroup>
                                                        <Carousel2
                                                        focusOnSelect={true}
                                                        swipeable={true}
                                                        draggable={true}
                                                        showDots={false}
                                                        responsive={responsive}
                                                        arrows={false} 
                                                        renderButtonGroupOutside={true}
                                                        ssr={true} // means to render carousel on server-side.
                                                        infinite={true}
                                                        autoPlay={false}
                                                        keyBoardControl={true}
                                                        customTransition="all .5"
                                                        transitionDuration={500}
                                                        containerClass="carousel-container"
                                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                                        dotListClass="custom-dot-list-style"
                                                        itemClass="carousel-item-padding-20-px"
                                                        className="Itemcarousels"
                                                        >
                                                                {sides[0].map((component) => (component))}
                                                        </Carousel2>
                                                        </div>}
                                                        {!addSectionSide[i] &&
                                                        <Button
                                                        key={"addSide" + i}
                                                        onClick={() => handleAddSideSection(i)}
                                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                        margin: "0 auto", marginBottom: "60px", textTransform: "none", color: "#F2BD2B",
                                                        width: window.innerWidth > 760 ? "49%" : "39%", 
                                                        display: "block", height: "100%", textAlign: "center"}}>
                                                        <div
                                                        style={{margin: "0 auto"}}>
                                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a side</h2>
                                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                                        </div>
                                                        </Button>
                                                        }
                                                        </Grid>
                        
                                                        {/* Add a drink button */}
                                                        <Grid item xs={4} style={{textAlign: "center", marginBottom: "40px"}}>
                                                        {addSectionDrink[i] &&
                                                        <div key={"sectionD" + i}>
                                                        <ButtonGroup size="medium" variant="contained" style={{marginLeft: "70px", width: "5%", display: "flex", backgroundColor: "black", color: "white", borderRadius: "20px"}}>
                                                        {<Button onClick={() => {drinkCounter[i] = drinkCounter[i] + 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>+</Button>}
                                                        {(drinkCounter[i] > 0) && <Button disabled style={{backgroundColor: "black", color: "white"}}>{drinkCounter[i]}</Button>}
                                                        {(drinkCounter[i] > 0) && <Button onClick={() => {drinkCounter[i] = drinkCounter[i] - 1; forceUpdate();}} style={{backgroundColor: "black", color: "white"}}>-</Button>}                                         
                                                        </ButtonGroup>
                                                        <Carousel2
                                                        focusOnSelect={true}
                                                        swipeable={true}
                                                        draggable={true}
                                                        showDots={false}
                                                        responsive={responsive}
                                                        ssr={true} // means to render carousel on server-side.
                                                        arrows={false} 
                                                        renderButtonGroupOutside={true}
                                                        infinite={true}
                                                        autoPlay={false}
                                                        keyBoardControl={true}
                                                        customTransition="all .5"
                                                        transitionDuration={500}
                                                        containerClass="carousel-container"
                                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                                        dotListClass="custom-dot-list-style"
                                                        itemClass="carousel-item-padding-20-px"
                                                        className="Itemcarousels"
                                                        >
                                                                {drinks.map((component) => (component))}
                                                        </Carousel2>
                                                        </div>}
                                                        {!addSectionDrink[i] &&
                                                        <Button
                                                        onClick={() => handleAddDrinkSection(i)}
                                                        key={"addDrink" + i}
                                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                                margin: "0 auto", marginBottom: "60px", textTransform: "none", color: "#F2BD2B",
                                                                width: window.innerWidth > 760 ? "49%" : "39%", 
                                                                display: "block", height: "100%", textAlign: "center"}}>
                                                        <div
                                                        style={{margin: "0 auto"}}>
                                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a drink</h2>
                                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                                        </div>
                                                        </Button>
                                                        }
                                                        </Grid>
                                                </Grid>
                                        );
                                })}

                                {/* add a section button */}
                                {sectionCounter > 0 && 
                                        <Button
                                        onClick={handleAddSection}
                                        key={"addSection"} 
                                        style={{textTransform: "none", color: "#F2BD2B",
                                                boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                margin: "0 auto", marginBottom: "40px", width: window.innerWidth > 760 ? "20%" : "30%", 
                                                display: "block", height: "100%", textAlign: "center"}}
                                        >
                                        <div style={{margin: "0 auto"}}>
                                        <h2 className="selectedItem-titles" style={{color: "#F2BD2B", paddingTop: "10px"}}>Add a section</h2>
                                        <AddCircleIcon style={{margin: "0 auto", color: "#F2BD2B"}}/>
                                        </div>
                                        </Button>
                                }
                                
                                {/* comments box & add to cart */}
                                <Grid
                                key={"CCbox"} 
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                style={{width: window.innerWidth > 760 ? "50%" : "100%", margin: "0 auto"}}
                                >
                                        {/* customer comments box */}
                                        <Grid item xs={7} style={{textAlign: "center", marginTop: "40px"}}>
                                        <TextField 
                                        fullWidth={true}
                                        multiline 
                                        rows={4}
                                        label="Special instructions" 
                                        id="fullWidth"
                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                margin: "0 auto", marginBottom: "40px", textTransform: "none", color: "#F2BD2B"}} />
                                        </Grid>
                                        {/* add to cart button */}
                                        <Grid item xs={10} style={{textAlign: "center", marginTop: "10px"}}>
                                        <Button
                                        onClick={() => console.log(sectioninfo)}
                                        key={"addToCart"}
                                        style={{ boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                                margin: "0 auto", marginBottom: "40px", textTransform: "none", backgroundColor: "#F2BD2B",
                                                width: "70%"}}>
                                        <h2 className="selectedItem-titles" style={{textAlign: "left", color: "white", paddingTop: "10px", width: "50%"}}>Add to cart</h2>
                                        <h2 className="selectedItem-titles" style={{textAlign: "right", color: "white", paddingTop: "10px", width: "50%"}}>{sumPrices.toFixed(2)} $</h2>
                                        </Button>
                                        </Grid>

                                </Grid>
                </div>
        );
}