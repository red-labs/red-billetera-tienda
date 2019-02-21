import React from "react";
import { Alert } from "reactstrap";
import { withI18n } from "react-i18next";
import { Subscribe } from "unstated";
import { AppContainer } from "../store";

interface Props {
  msg: string;
  color: string;
  isOpen: boolean;
  t: Function;
  toggle: Function;
}

function RenderAlert(props: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
        right: 10,
        display: "flex",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <Alert
        style={{ width: "100%" }}
        isOpen={props.isOpen}
        color={props.color}
        toggle={() => props.toggle()}
      >
        {props.t(props.msg)}
      </Alert>
    </div>
  );
}

export default withI18n()(RenderAlert);
