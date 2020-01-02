import { Component, h, State, Prop } from "@stencil/core";
import { interpret, Interpreter } from "xstate";
import { toggleMachine, ToggleContext, ToggleStateSchema, ToggleEvent, Events } from "./toggle-machine";

@Component({
  tag: "x-toggle",
  styleUrl: "toggle.css",
  shadow: true
})
export class XToggle {

  @State() state: ToggleStateSchema;

  @Prop() checked: boolean;

  service: Interpreter<ToggleContext, ToggleStateSchema, ToggleEvent>;

  componentWillLoad() {
    this.service = interpret<ToggleContext, ToggleStateSchema, ToggleEvent>(toggleMachine.withContext({
      checked: this.checked
    })).onTransition(current => {
      this.state = { current }
    });

    this.service.start();
    this.service.send(Events.START);
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {
    const { current } = this.state;
    const { send } = this.service;

    return (
      <button onClick={() => send(Events.TOGGLE)}>
        {current.matches("active.unchecked") ? "Off" : "On"}
      </button>
    );
  }
}
