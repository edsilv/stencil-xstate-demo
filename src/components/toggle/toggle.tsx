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

  @Prop() enabled: boolean = false; // doesn't work yet!

  service: Interpreter<ToggleContext, ToggleStateSchema, ToggleEvent>;

  componentWillLoad() {

    // need to subscribe to prop changes and send events
    // e.g. this.service.send(Events.ENABLE);
    // what's the best way to watch props without duplicating code and that works on initial load?

    this.service = interpret(toggleMachine).onTransition(current => {
      this.state = { current }
    });

    this.service.start();
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {
    const { current } = this.state;
    const { send } = this.service;

    return (
      <button onClick={() => send(Events.TOGGLE)}>
        {current.matches("disabled") ? "Off" : "On"}
      </button>
    );
  }
}
