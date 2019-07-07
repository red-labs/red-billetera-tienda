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
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          transform: "translateX(-100vw) translateY(20px)",
          transition: "all .1s ease"

        },
        ...(props.isOpen
          ? {
              transform: "translateX(0px) translateY(0px)"
            }
          : {})
      }}
    >
      <div
        style={{
          background: "#F3F4FA", //"rgba(255,255,255,0.5)"
          flex: 1,
          maxWidth: 450,
          maxHeight: 900,
          margin: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {props.isOpen && props.children}
      </div>
    </div>
  );
}

export function ScreenHeader(props: { children: any; toggle: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "#F23C22",
      justifyContent: "space-between",
      textAlign: "left"

      }}
    >
      <div className="back-click"

        onClick={props.toggle}
      >
        {leftChevron("#F23C22", 30, 30)} Atrás
      </div>

      <div
        style={{
          height: 50,
          width: 50
        }}
      />
    </div>
  );
}

export function ScreenBody(props: { children: any }) {
  return (
    <div
      style={{
        overflow: "scroll"
      }}
    >
      <div style={{ padding: "1rem", marginBottom: "4rem" }}>
        {props.children}
      </div>
    </div>
  );
}
