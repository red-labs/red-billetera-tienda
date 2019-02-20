import React from "react";
import { Alert } from "reactstrap";
import { withI18n } from "react-i18next";

interface Props {
  msg: string;
  color: string;
  number: number;
  isOpen: boolean;
  t: Function;
  toggle: Function;
}

function RenderAlert(props: Props) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10 * props.number,
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
