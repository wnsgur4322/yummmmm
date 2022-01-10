/*
Menu.js
Author: Derek Jeong
Description: Menu.js is a react hook component for rendering /menu page for customer side.
This page let users make their own orders with menu interfaces.
*/

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Container, ButtonGroup, Form, Modal, Dropdown, CardColumns } from "react-bootstrap";
import {
        makeStyles, Avatar, IconButton, FormGroup, FormControlLabel, Checkbox,
        Grid, Typography, Card, CardContent, CardMedia, Button, CardActionArea, CardActions,
        Slide, Box, createTheme, ThemeProvider, Divider, Paper
        } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import {Link} from 'react-scroll';
import { useCartOpenContext, useItemAddedContext, useSelectedMainContext, useSelectedItemContext } from "../../libs/contextLib";
import './Menu.css';

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
import AddIcon from '@material-ui/icons/Add';
import { FaShoppingCart } from "react-icons/fa";
import Carousel2 from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Menu() {
        const history = useHistory();
        const [checked, setChecked] = useState(true);

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

        const [orderCart, setOrderCart] = useState(new Array());
        const [editItems, setEditItems] = useState(new Array());

        const [clickedMenu, setClickedMenu] = useState(mostPopularList);
        const [responsiveXS, setResponsiveXS] = useState(12);

        // modals
        const {cartOpen, setCartOpen} = useCartOpenContext();
        const {isItemAdded, setIsItemAdded} = useItemAddedContext();
        const [removeItemOpen, setRemoveItemOpen] = useState(false);
        const [removeItem, setRemoveItem] = useState();
        const [itemCounter, setItemCounter] = useState(0);
        const [editItemOpen, setEditItemOpen] = useState(false);
        const [editItem, setEditItem] = useState();
        const [contactOpen, setContactOpen] = useState();
        
        // delivery method
        const [pickupChecked, setPickupChecked] = useState(false);
        const [deliveryChecked, setDeliveryChecked] = useState(false);

        // edit item
        const [sideChecked0, setSideChecked0] = useState(false);
        const [sideChecked1, setSideChecked1] = useState(false);
        const [sideChecked2, setSideChecked2] = useState(false);
        const [naChecked, setNaChecked] = useState(false);

        const useStyles = makeStyles(theme => ({
                menuClicked: {
                  "&:focus": { backgroundColor: "white"},
                  "&:active": { background: "white"}
                },
                parentFlexSplit: {
                        display: "flex",
                        bottom: 0,
                        justifyContent: "space-between"
                },
        }));

        const buttonStyle = useStyles();

        const ResponsiveTheme = createTheme({
                breakpoints: {
                  values: {
                    mobile: 0,
                    tablet: 640,
                    laptop: 1024,
                    desktop: 1280,
                  },
                },
        });

        useEffect(() => {
                console.log(window.innerWidth, window.innerHeight);
                if (window.innerWidth > 760){
                        setResponsiveXS(4);
                };
        }, []);
        
        const handleAllMenuOpen = () => {
                setChecked(false);
                setClickedMenu(mostPopularList);
                setChecked(true);
        };
        const handleBurgerMenuOpen = () => {
                setChecked(false);
                setClickedMenu(burgerList);
                setChecked(true);
        };
        const handleDrinkMenuOpen = () => {
                setChecked(false);
                setClickedMenu(drinkList);
                setChecked(true);
        };
        const handleSideMenuOpen = () => {
                setChecked(false);
                setClickedMenu(sideList);
                setChecked(true);
        };

        const handleCartOpen = () => {
		setCartOpen(true);
	};
	const handleCartClose = () => {
		setCartOpen(false);
	};

        // this function will be called when a user clicked 'Select Item' button on each menu item.
        // when this function has called, item modal will be poped up.
        const {selectedMain, setSelectedMain} = useSelectedMainContext();
        const {selectedItem, setSelectedItem} = useSelectedItemContext();
        const [itemOpen, setItemOpen] = useState(false);

        const handleSelectedmain = (event, key, calories, price) => {
                event.preventDefault();
                selectedMain.push([key, calories, price]);
                if (selectedMain.length >= 2){
                        selectedMain.shift();
                }
                console.log("selectedMain:", selectedMain);
        }

        const handleItemOpen = (food, img, calories, description, price) => {
                
                selectedItem.push(
                        <Button
                        onClick={(event) => handleSelectedmain(event, food, calories, price)}
                        className="Itembutton"
                        key={food}
                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                        backgroundColor: "#f7f7f7", textTransform: "none", padding: "0",
                        display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%",
                        }}>
                        <CardMedia
                        component="img"
                        image={img}
                        alt={"ad"}
                        style={{margin: "0 auto", backgroundColor: "white" }}
                        height="250"
                        />
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h2 className="selectedItem-titles" style={{color: "black", paddingTop: "10px", paddingLeft: "8px"}}>{food}</h2>
                        <p style={{paddingTop: "10px", paddingRight: "8px"}}>{calories}</p>
                        </div>
                        <div
                        style={{ position:"relative", bottom: 0}}>
                        <CardActions>
                                <Typography size="small" color="textPrimary">
                                $ {price}
                                </Typography>
                        </CardActions>
                        </div>
                        </Button>
                );

                Object.entries(burgerList).map(([key, value]) => {
                        if (key !== food) {
                                selectedItem.push(
                                        <Button
                                        onClick={(event) => handleSelectedmain(event, key, value[1], value[3])}
                                        className="Itembutton"
                                        key={key}
                                        style={{boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                        backgroundColor: "#f7f7f7", textTransform: "none", padding: "0",
                                        display: "block", margin: "0 auto", height: "100%", width: window.innerWidth > 760 ? "70%" : "80%",
                                        }}>
                                                <CardMedia
                                                component="img"
                                                image={value[0]}
                                                alt={"ad"}
                                                style={{margin: "0 auto", backgroundColor: "white" }}
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
                        }
                });
                setSelectedMain(new Array());
                history.push("/selectedItem");
        }

        const handleItemClose = () => {
                setSelectedItem(new Array());
        }

        // this function will be called when a user clicked 'Add to Cart' button on each menu item.
        // if this function has called, then every card component is pushed to rendering array.
        const handleAddtoCart = (food, img) => {
                setItemCounter(itemCounter + 1);
                setIsItemAdded(true);
                orderCart.push(
                        <Grid key={food + itemCounter} item xs={12} style={{textAlign: "center"}}>
                                <Card key={food + itemCounter} sx={{ display: 'flex'}}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                <CardMedia
                                                component="img"
                                                image={img}
                                                alt={food}
                                                className="card-media"
                                                />
                                                <CardContent sx={{ flex: '1 0 auto' }}>
                                                        <h5 className="card-titles">
                                                        {food}
                                                        </h5>
                                                        <p className="card-para">
                                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum 
                                                        </p>
                                                </CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', pl: 0, pb: 0 }}>
                                                <Typography size="small" color="textPrimary">
                                                $ 12.34
                                                </Typography>
                                                <IconButton
                                                id={"All"}
                                                edge="end"
                                                aria-label="Menu"
                                                onClick={() => handleEditItemOpen(food + itemCounter)}
                                                style={{margin: "0 auto"}}
                                                type="add"
                                                >
                                                        <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                id={"All"}
                                                edge="end"
                                                aria-label="Menu"
                                                onClick={() => handleRemoveItemOpen(food + itemCounter)}
                                                style={{margin: "0 auto"}}
                                                type="add"
                                                >
                                                        <DeleteIcon/>
                                                </IconButton>
                                                </Box>
                                        </Box>
                                </Card>
                        </Grid>
                )
                editItems.push(
                        <Card key={food + itemCounter} sx={{ maxWidth: 345 }} className="card">
                                <CardActionArea>
                                        <CardMedia
                                        component="img"
                                        height="140"
                                        image={img}
                                        alt={food}
                                        />
                                        <CardContent>
                                        <h5 className="card-titles">
                                        {food}
                                        </h5>
                                        <p className="card-para">
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum 
                                        </p>
                                        </CardContent>
                                </CardActionArea>
                                <CardContent>
                                        <h5 className="edit-titles">CHOOSE YOUR SIDE:</h5>
                                        <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                        <FormControlLabel
                                        key="side0"
                                        value="side0"
                                        control={<Checkbox
                                                checked={sideChecked0}
                                                disabled={naChecked}
                                                onChange={(event) => setSideChecked0(event.target.checked)} />
                                        }
                                        label="French Fries"
                                        labelPlacement="end"
                                        />
                                        </div>
                                        <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                        <FormControlLabel
                                        key="side1"
                                        value="end"
                                        control={<Checkbox
                                                checked={sideChecked1}
                                                disabled={naChecked}
                                                onChange={(event) => setSideChecked1(event.target.checked)} />
                                        }
                                        label="Mac & Cheese"
                                        labelPlacement="end"
                                        />
                                        </div>
                                        <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                        <FormControlLabel
                                        key="side2"
                                        value="end"
                                        control={<Checkbox
                                                checked={sideChecked2}
                                                disabled={naChecked}
                                                onChange={(event) => setSideChecked2(event.target.checked)} />
                                        }
                                        label="Salad"
                                        labelPlacement="end"
                                        />
                                        </div>
                                        <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                        <FormControlLabel
                                        key="side3"
                                        value="none"
                                        control={<Checkbox
                                                checked={naChecked}
                                                disabled={sideChecked0 || sideChecked1 || sideChecked2}
                                                onChange={(event) => setNaChecked(event.target.checked)} />
                                        }
                                        label="N/A"
                                        labelPlacement="end"
                                        />
                                        </div>
                                </CardContent>
                                <CardActions
                                className={buttonStyle.parentFlexSplit}>
                                        <Button 
                                        size="small" 
                                        color="primary"
                                        onClick={() => console.log("onclick!")}>
                                        Add to cart
                                        </Button>
                                        <Typography size="small" color="textPrimary">
                                        $ 12.34
                                        </Typography>
                                </CardActions>
                        </Card>
                )
        }

        const handleRemoveItemOpen = (key) => {
                setRemoveItemOpen(true);
                setRemoveItem(key);
                console.log(key);
        }

        const handleRemoveItemClose = () => {
                setRemoveItemOpen(false);
        }

        const handleEditItemOpen = (key) => {
                setEditItemOpen(true);
                setEditItem(key);
                console.log(key);
        }

        const handleEditItemClose = () => {
                setEditItemOpen(false);
        }

        const handleContactOpen = () => {
                setContactOpen(true);
        }

        const handleContactClose = () => {
                setContactOpen(false);
        }

        const removeItemConfirm = () => {
                console.log("remove item:", removeItem);
                const filteredArray = orderCart.filter(item => item.key !== removeItem);
                setOrderCart(filteredArray);
                console.log(orderCart, orderCart.length);
                if (orderCart.length < 2){
                        setIsItemAdded(false);
                        handleCartClose();
                };

                const filteredEditArray = editItems.filter(item => item.key !== removeItem);
                setEditItems(filteredEditArray);
                handleRemoveItemClose();
        }
        
        function menuItemRender(food, img) {

                return(
                        <Grid key={food} item xs={responsiveXS} style={{textAlign: "center"}}>
                                <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
                                <Card key={food} sx={{ maxWidth: 345 }} className="card">
                                        <CardActionArea>
                                                <CardMedia
                                                component="img"
                                                height="140"
                                                image={img}
                                                alt={food}
                                                />
                                                <CardContent>
                                                <h5 className="card-titles">
                                                {food}
                                                </h5>
                                                <p className="card-para">
                                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aut, repellat ipsum 
                                                </p>
                                                </CardContent>
                                        </CardActionArea>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                onClick={() => handleAddtoCart(food, img)}>
                                                Add to cart
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ 12.34
                                                </Typography>
                                        </CardActions>
                                </Card>
                                </Slide>
                        </Grid>
                );
        }

        // Ad box with carousel
        const ADitems = [
                {
                    name: "50% OFF",
                    description: "only for today !",
                    ad_img: salad_ad
                },
                {
                    name: "30% OFF",
                    description: "only for this week !!",
                    ad_img: burger_ad
                }
        ]

        function Item(props)
        {
            return (
                <Paper style={{backgroundColor: "#FFE190", marginBottom: "20px", display: "block"}}>
                        <CardMedia
                        component="img"
                        image={props.item.ad_img}
                        alt={"ad"}
                        style={{width: window.innerWidth > 760 ? "50%" : "90%", margin: "0 auto", paddingTop: "10px"}}
                        height="200"
                        />
                    <h2 className="menu-titles" style={{color: "black"}}>{props.item.name}</h2>
                    <p>{props.item.description}</p>
                </Paper>
            )
        }

        // menu item carousels
        const responsive = {
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 4,
                  slidesToSlide: 1, // optional, default to 1.
                  partialVisibilityGutter: 30
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 2,
                  slidesToSlide: 1, // optional, default to 1.
                  partialVisibilityGutter: 30
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                  slidesToSlide: 1, // optional, default to 1.
                  partialVisibilityGutter: 30
                }
        };

        return (
                <div className="menu">
                        <div>
                        {/* cart modal */}
                        <Modal
                        key={0}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        show={cartOpen}
                        onHide={handleCartClose}
                        >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Your Order
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <p className="cart-titles">Your items</p>
                                <Grid
                                key={1} 
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="center"
                                alignItems="stretch"
                                style={{width: "100%", margin: "0 auto"}}>
                                        {orderCart.map((component) => (component))}
                                </Grid>
                                <br></br>
                                <Divider/>
                                <p className="cart-titles">Delivery method</p>
                                <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                <FormControlLabel
                                value="end"
                                control={<Checkbox
                                        checked={pickupChecked}
                                        disabled={deliveryChecked}
                                        onChange={(event) => setPickupChecked(event.target.checked)} />}
                                label="Pick up"
                                labelPlacement="end"
                                />
                                </div>
                                <div style={{margin: "0 auto", height: "30px", textAlign: "left"}}>
                                <FormControlLabel
                                value="end"
                                control={<Checkbox
                                        checked={deliveryChecked}
                                        disabled={pickupChecked}
                                        onChange={(event) => setDeliveryChecked(event.target.checked)} />}
                                label="Delivery"
                                labelPlacement="end"
                                />
                                </div>
                                <br></br>
                                <Divider/>
                                <p className="cart-titles">Payment</p>
                                <IconButton
                                        id={"AddPayment"}
                                        edge="end"
                                        aria-label="AddPayment"
                                        onClick={() => console.log("clicked!")}
                                        style={{margin: "0 auto", paddingLeft: "15px"}}
                                        type="add"
                                        >
                                                <p className="cart-para">Add a Payment Method +</p>
                                </IconButton>
                                <Divider variant="middle"/>

                                <br></br>
                                <Divider/>
                                <p className="cart-titles">Contact Information</p>
                                <IconButton
                                        id={"AddContact"}
                                        edge="end"
                                        aria-label="AddPayment"
                                        onClick={handleContactOpen}
                                        style={{margin: "0 auto", paddingLeft: "15px"}}
                                        type="add"
                                        >
                                                <p className="cart-para">Add Your Contact Information +</p>
                                </IconButton>
                                <Divider variant="middle"/>

                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                </Row>
                                </Modal.Footer>
                        </Modal>
                        {/* item remove modal */}
                        <Modal
                        key={1}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={removeItemOpen}
                        onHide={handleRemoveItemClose}
                        >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Remove Item from Cart
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={removeItemConfirm}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Remove
                                                </Button>
                                        </Row>
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleRemoveItemClose}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                        </Row>
                                </Modal.Footer>
                        </Modal>
                        {/* item edit modal */}
                        <Modal
                        key={2}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={editItemOpen}
                        onHide={handleEditItemClose}
                        >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Edit item
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                        {editItems.find((component) => {
                                                return component.key === editItem
                                        })}
                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={() => console.log("onclicked!")}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Edit
                                                </Button>
                                        </Row>
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleEditItemClose}
                                                className="custom-btn-profile"
                                                blocksize="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                        </Row>
                                </Modal.Footer>
                        </Modal>
                        {/* contact information modal */}
                        <Modal
                        key={3}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        aria-describedby="contained-modal-description"
                        centered
                        style={{backgroundColor: "#f2ca64"}}
                        show={contactOpen}
                        onHide={handleContactClose}
                        >
                                <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                        Contact information
                                        </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>

                                </Modal.Body>
                                <Modal.Footer className="two-button">
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={() => console.log("onclicked!")}
                                                className="custom-btn-profile" 
                                                blocksize="md" 
                                                type="submit"
                                                >
                                                Save
                                                </Button>
                                        </Row>
                                        <Row className="row-profile">
                                                <Button
                                                as={Col}
                                                onClick={handleContactClose}
                                                className="custom-btn-profile"
                                                blocksize="md" 
                                                type="button"
                                                >
                                                Cancel
                                                </Button>
                                        </Row>
                                </Modal.Footer>
                        </Modal>
                        </div>
                        <Grid
                        key={0} 
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{width: "90%", margin: "0 auto"}}>
                                <Grid item xs={2} style={{textAlign: "center"}}>
                                        <IconButton
                                        edge="end"
                                        aria-label="Menu"
                                        style={{margin: "0 auto"}}
                                        type="add"
                                        className={buttonStyle.menuClicked}
                                        >
                                                <Link 
                                                style={{textDecoration: 'none'}}
                                                className="menu-titles" to="MostPopular" spy={true} smooth={true}>
                                                Most Popular
                                                </Link>
                                        </IconButton>
                                </Grid>
                                <Grid item xs={2} style={{textAlign: "center"}}>
                                        <IconButton
                                        edge="end"
                                        aria-label="Menu"
                                        style={{margin: "0 auto"}}
                                        type="add"
                                        className={buttonStyle.menuClicked}
                                        >
                                                <Link 
                                                style={{textDecoration: 'none'}}
                                                className="menu-titles" to="Burgers" spy={true} smooth={true}>
                                                Burgers
                                                </Link>
                                        </IconButton>
                                </Grid>
                                <Grid item xs={2} style={{textAlign: "center"}}>
                                        <IconButton
                                        edge="end"
                                        aria-label="Menu"
                                        onClick={handleBurgerMenuOpen}
                                        style={{margin: "0 auto"}}
                                        type="add"
                                        className={buttonStyle.menuClicked}
                                        >
                                                <Link 
                                                style={{textDecoration: 'none'}}
                                                className="menu-titles" to="ChickenSandwiches" spy={true} smooth={true}>
                                                Chicken Sandwiches
                                                </Link>
                                        </IconButton>
                                </Grid>
                                <Grid item xs={2} style={{textAlign: "center"}}>
                                        <IconButton
                                        edge="end"
                                        aria-label="Menu"
                                        onClick={handleDrinkMenuOpen}
                                        style={{margin: "0 auto"}}
                                        type="add"
                                        className={buttonStyle.menuClicked}
                                        >
                                                <Link 
                                                style={{textDecoration: 'none'}}
                                                className="menu-titles" to="Drinks" spy={true} smooth={true}>
                                                Drinks
                                                </Link>
                                        </IconButton>
                                </Grid>
                                <Grid item xs={2} style={{textAlign: "center"}}>
                                        <IconButton
                                        edge="end"
                                        aria-label="Menu"
                                        onClick={handleSideMenuOpen}
                                        style={{margin: "0 auto"}}
                                        type="add"
                                        className={buttonStyle.menuClicked}
                                        >
                                                <Link 
                                                style={{textDecoration: 'none'}}
                                                className="menu-titles" to="Sides" spy={true} smooth={true}>
                                                Sides
                                                </Link>
                                        </IconButton>
                                </Grid>
                                <Grid item xs={2} style={{textAlign: "right"}}>
					<Button
						disabled={!isItemAdded}
						edge="end"
						aria-label="Menu"
						onClick={handleCartOpen}
                                                style={{width: "50%", backgroundColor: "#F2BD2B", borderRadius: "10px"}}
						type="add"
						>
						<FaShoppingCart className="cart"/>
                                        </Button>
			        </Grid> 
                        </Grid> 

                        {/* ad box carousel */}
                        <Grid
                        key={1} 
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{width: window.innerWidth > 760 ? "50%" : "90%", margin: "0 auto"}}
                        >
                                <Grid item xs={10} style={{textAlign: "center"}}>
                                <Carousel 
                                fullHeightHover={false}
                                navButtonsWrapperProps={{   
                                        // Move the buttons to the bottom. Unsetting top here to override default style.
                                        style: {
                                        bottom: '1',
                                        top: '1',
                                        }
                                }}
                                navButtonsProps={{          
                                        // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                                        style: {
                                            backgroundColor: 'grey',
                                        }
                                    }}
                                indicators={false}
                                >
                                {
                                        ADitems.map( (item, i) => <Item key={i} item={item}/> )
                                }
                                </Carousel>
                                </Grid>
                        </Grid>
                        {/* most popular item carousel */}
                        <div
                        id={"MostPopular"} 
                        style={{textAlign: "center", justifyContent: "center"}}>
                                <h2 className="menu-titles" style={{color: "black", marginTop: "40px", marginBottom: "10px"}}>Most Popular</h2>
                                <Carousel2
                                focusOnSelect={true}
                                partialVisible={true}
                                swipeable={true}
                                draggable={true}
                                showDots={false}
                                responsive={responsive}
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
                                >
                                {Object.entries(mostPopularList).map(([key, value]) => (
                                        <Paper
                                        key={key} 
                                        style={{backgroundColor: "#f7f7f7", marginBottom: "0px", 
                                        display: "block", marginLeft: "10px", marginRight: "10px", height: "100%"}}>
                                        <h2 className="menu-titles" style={{backgroundColor: "white", color: "black"}}>{key}</h2>
                                        <CardMedia
                                        component="img"
                                        image={value[0]}
                                        alt={"ad"}
                                        style={{width: "100%", margin: "0 auto", paddingTop: "10px", backgroundColor: "white" }}
                                        height="200"
                                        />
                                        <p style={{paddingTop: "10px", backgroundColor: "white"}}>{value[1]}</p>
                                        <div className="item-desc">
                                        <p>{value[2]}</p>
                                        </div>
                                        <div
                                        style={{ position:"relative", bottom: 0}}>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                // menu item format: [image file, calories, description, price]
                                                onClick={()=> handleItemOpen(key, value[0], value[1], value[2], value[3])}
                                                style={{color: "#F2BD2B"}}>
                                                Select item
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ {value[3]}
                                                </Typography>
                                        </CardActions>
                                        </div>
                                        </Paper>
                                ))}
                                </Carousel2>
                        </div>
                        {/* bruger item carousel */}
                        <div 
                        id={"Burgers"}
                        style={{textAlign: "center", justifyContent: "center"}}>
                                <h2 className="menu-titles" style={{color: "black", marginTop: "40px", marginBottom: "10px"}}>Burgers</h2>
                                <Carousel2
                                partialVisible={true}
                                swipeable={true}
                                draggable={true}
                                showDots={false}
                                responsive={responsive}
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
                                >
                                {Object.entries(burgerList).map(([key, value]) => (
                                        <Paper
                                        key={key} 
                                        style={{backgroundColor: "#f7f7f7", marginBottom: "0px", 
                                        display: "block", marginLeft: "10px", marginRight: "10px", height: "100%"}}>
                                        <h2 className="menu-titles" style={{backgroundColor: "white", color: "black"}}>{key}</h2>
                                        <CardMedia
                                        component="img"
                                        image={value[0]}
                                        alt={"ad"}
                                        style={{width: "100%", margin: "0 auto", paddingTop: "10px", backgroundColor: "white" }}
                                        height="200"
                                        />
                                        <p style={{paddingTop: "10px", backgroundColor: "white"}}>{value[1]}</p>
                                        <div className="item-desc">
                                        <p>{value[2]}</p>
                                        </div>
                                        <div
                                        style={{ position:"relative", bottom: 0}}>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                onClick={()=> handleItemOpen(key, value[0], value[1], value[2], value[3])}
                                                style={{color: "#F2BD2B"}}>
                                                Select item
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ {value[3]}
                                                </Typography>
                                        </CardActions>
                                        </div>
                                        </Paper>
                                ))}
                                </Carousel2>
                        </div>
                        {/* chicken sandwich item carousel */}
                        <div 
                        id={"ChickenSandwiches"}
                        style={{textAlign: "center", justifyContent: "center"}}>
                                <h2 className="menu-titles" style={{color: "black", marginTop: "40px", marginBottom: "10px"}}>Chicken Sandwiches</h2>
                                <Carousel2
                                partialVisible={true}
                                swipeable={true}
                                draggable={true}
                                showDots={false}
                                responsive={responsive}
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
                                >
                                {Object.entries(chickenSList).map(([key, value]) => (
                                        <Paper
                                        key={key} 
                                        style={{backgroundColor: "#f7f7f7", marginBottom: "0px", 
                                        display: "block", marginLeft: "10px", marginRight: "10px", height: "100%"}}>
                                        <h2 className="menu-titles" style={{backgroundColor: "white", color: "black"}}>{key}</h2>
                                        <CardMedia
                                        component="img"
                                        image={value[0]}
                                        alt={"ad"}
                                        style={{width: "100%", margin: "0 auto", paddingTop: "10px", backgroundColor: "white" }}
                                        height="200"
                                        />
                                        <p style={{paddingTop: "10px", backgroundColor: "white"}}>{value[1]}</p>
                                        <div className="item-desc">
                                        <p>{value[2]}</p>
                                        </div>
                                        <div
                                        style={{ position:"relative", bottom: 0}}>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                onClick={()=> handleItemOpen(key, value[0], value[1], value[2], value[3])}
                                                style={{color: "#F2BD2B"}}>
                                                Select item
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ {value[3]}
                                                </Typography>
                                        </CardActions>
                                        </div>
                                        </Paper>
                                ))}
                                </Carousel2>
                        </div>
                        {/*  drink item carousel */}
                        <div 
                        id={"Drinks"}
                        style={{textAlign: "center", justifyContent: "center"}}>
                                <h2 className="menu-titles" style={{color: "black", marginTop: "40px", marginBottom: "10px"}}>Drinks</h2>
                                <Carousel2
                                partialVisible={true}
                                swipeable={true}
                                draggable={true}
                                showDots={false}
                                responsive={responsive}
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
                                >
                                {Object.entries(drinkList).map(([key, value]) => (
                                        <Paper
                                        key={key} 
                                        style={{backgroundColor: "#f7f7f7", marginBottom: "0px", 
                                        display: "block", marginLeft: "10px", marginRight: "10px", height: "100%"}}>
                                        <h2 className="menu-titles" style={{backgroundColor: "white", color: "black"}}>{key}</h2>
                                        <CardMedia
                                        component="img"
                                        image={value[0]}
                                        alt={"ad"}
                                        style={{width: "100%", margin: "0 auto", paddingTop: "10px", backgroundColor: "white" }}
                                        height="200"
                                        />
                                        <p style={{paddingTop: "10px", backgroundColor: "white"}}>{value[1]}</p>
                                        <div className="item-desc">
                                        <p>{value[2]}</p>
                                        </div>
                                        <div
                                        style={{ position:"relative", bottom: 0}}>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                onClick={()=> handleItemOpen(key, value[0], value[1], value[2], value[3])}
                                                style={{color: "#F2BD2B"}}>
                                                Select item
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ {value[3]}
                                                </Typography>
                                        </CardActions>
                                        </div>
                                        </Paper>
                                ))}
                                </Carousel2>
                        </div>
                        {/* side item carousel */}
                        <div 
                        id={"Sides"}
                        style={{textAlign: "center", justifyContent: "center"}}>
                                <h2 className="menu-titles" style={{color: "black", marginTop: "40px", marginBottom: "10px"}}>Sides</h2>
                                <Carousel2
                                partialVisible={true}
                                swipeable={true}
                                draggable={true}
                                showDots={false}
                                responsive={responsive}
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
                                >
                                {Object.entries(sideList).map(([key, value]) => (
                                        <Paper
                                        key={key} 
                                        style={{backgroundColor: "#f7f7f7", 
                                        display: "block", marginLeft: "10px", marginRight: "10px", height: "100%"}}>
                                        <h2 className="menu-titles" style={{backgroundColor: "white", color: "black"}}>{key}</h2>
                                        <CardMedia
                                        component="img"
                                        image={value[0]}
                                        alt={"ad"}
                                        style={{width: "100%", margin: "0 auto", paddingTop: "10px", backgroundColor: "white" }}
                                        height="200"
                                        />
                                        <p style={{paddingTop: "10px", backgroundColor: "white"}}>{value[1]}</p>
                                        <div className="item-desc">
                                        <p>{value[2]}</p>
                                        </div>
                                        <div
                                        style={{ position:"relative", bottom: 0}}>
                                        <CardActions
                                        className={buttonStyle.parentFlexSplit}>
                                                <Button 
                                                size="small" 
                                                color="primary"
                                                onClick={()=> handleItemOpen(key, value[0], value[1], value[2], value[3])}
                                                style={{color: "#F2BD2B"}}>
                                                Select item
                                                </Button>
                                                <Typography size="small" color="textPrimary">
                                                $ {value[3]}
                                                </Typography>
                                        </CardActions>
                                        </div>
                                        </Paper>
                                ))}
                                </Carousel2>
                        </div>

                </div>
        );

}