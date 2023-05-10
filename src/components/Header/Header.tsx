import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ReactComponent as Person } from "../../assets/icons/person.svg";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import { AuthStore } from "../../stores/AuthStore";
import s from "./header.module.scss";
import { useStore } from "../../stores/GlobalStoreContext";

export function Header() {
  const authStore = useStore<AuthStore>("authStore");
  const routes = Routes.map((item) => {
    return item.path;
  });

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className={s.Header__content}>
        <Navbar.Brand as={Link} to={"/"}>
          React Template
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <NavDropdown title="Global links" id="basic-nav-dropdown">
              {routes.map((path, key) => (
                <NavDropdown.Item key={key} as={Link} to={path || "/"}>
                  {path}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          {authStore.isAuth && (
            <Link to={"/profile"} className={s.Header__profile}>
              <Person />
            </Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
