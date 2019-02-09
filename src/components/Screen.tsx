import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Alert,
  Navbar
} from "reactstrap";
import { copy as copyIcon, camera, leftChevron } from "../utils/icons";
import React, { Component } from "react";
import copy from "clipboard-copy";
import { withI18n } from "react-i18next";
import { Subscribe } from "unstated";
import { AppContainer } from "../store";

// interface Props {
//   open: boolean;
//   toggle: () => void;
// }

// interface State {}

// class Screen extends Component<Props, State> {
//   render() {
//       return
//   }
// }

export function Screen(props: {
  children: any;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <div
      style={{
        ...{
          position: "fixed",
          top: 20,
          background: "white",
          width: "100vw",
          height: "100vh",
          transform: "translateX(-100vw)",
          transition: "all .1s ease, top .11s ease-out"
        },
        ...(props.isOpen
          ? {
              top: 0,
              transform: "translateX(0px) translateY(0px)"
            }
          : {})
      }}
    >
      {props.children}
    </div>
  );
}

export function TopBar(props: { children: any; toggle: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f8f9fa"
      }}
    >
      <div
        style={{
          height: 50,
          width: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={props.toggle}
      >
        {leftChevron("#000", 30, 30)}
      </div>{" "}
      <h5 style={{ marginBottom: 0 }}>{props.children}</h5>
      <div
        style={{
          height: 50,
          width: 50
        }}
      />
    </div>
  );
}
