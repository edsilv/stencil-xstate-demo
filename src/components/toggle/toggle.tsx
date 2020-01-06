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

  @Prop() checked: boolean = false;

  private _service: Interpreter<ToggleContext, ToggleStateSchema, ToggleEvent>;

  componentWillLoad() {
    this._service = interpret<ToggleContext, ToggleStateSchema, ToggleEvent>(toggleMachine.withContext({
      checked: this.checked
    })).onTransition(current => {
      this.state = { current }
    });

    this._service.start();
    this._service.send(Events.START);
  }

  componentDidUnload() {
    this._service.stop();
  }

  render() {
    const { current } = this.state;
    const { send } = this._service;

    return (
      <button onClick={() => send(Events.TOGGLE)}>
        {current.matches("active.unchecked") ? "Off" : "On"}
      </button>
    );
  }
}
