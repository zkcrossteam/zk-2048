import React, { createRef, useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { loginL1AccountAsync, selectL1Account } from "../data/accountSlice";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";

import logo from "../images/logo.png";

export function MainNavBar() {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  return (
    <Navbar bg="light" expand="lg" style={{ zIndex: "1000" }}>
      <Navbar.Brand href="http://www.delphinuslab.com">
        <img src={logo} height="30" alt=""></img>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {account && (
            <div className="nav-link">
              <Navbar.Text> <i className="bi bi-person"></i> Account Connected: {account.address}</Navbar.Text>
            </div>
          )}
          {!account && (
            <Nav.Link onClick={() => dispatch(loginL1AccountAsync())}>
              Connect Wallet
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
