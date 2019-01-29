import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Label
} from "reactstrap";
import { qr, camera } from "./icons";
import React, { Component } from "react";

interface Props {
  open: boolean;
  toggle: () => void;
}

interface State {}

class Send extends Component<Props, State> {
  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Send</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="sendToAddress">Send to address</Label>
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Input
                name="sendToAddress"
                id="sendToAddress"
                placeholder="0x..."
                style={{ flexGrow: 1, marginRight: 5 }}
              />
              <Button style={{ flexGrow: 1, marginLeft: 5 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  {camera("#fff")}
                  {qr("#fff")}
                </div>
              </Button>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="amountToSend">Send amount</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">$</InputGroupAddon>
              <Input name="amountToSend" id="amountToSend" placeholder="0.00" />
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            Send
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default Send;
