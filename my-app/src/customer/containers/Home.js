/*
Home.js
Author: Derek Jeong
Description: Home.js is a react hook component for rendering Home page of the Restuarant App.
*/

import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="Home">
      <div className="lander">
        <h1>Online Shop</h1>
        <p className="text-muted">Powered by Wizrds LLC</p>
      </div>
    </div>
  );
}