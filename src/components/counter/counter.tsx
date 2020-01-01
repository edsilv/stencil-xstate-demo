import { Component, h, State } from "@stencil/core";
import { interpret, Interpreter } from "xstate";
import { counterMachine, CounterContext, CounterStateSchema, CounterEvent, Events } from "./counter-machine";

@Component({
  tag: "x-counter",
  styleUrl: "counter.css",
  shadow: true
})
export class XCounter {

  @State() state: CounterStateSchema;

  service: Interpreter<CounterContext, CounterStateSchema, CounterEvent>;

  componentWillLoad() {
    this.service = interpret(counterMachine).onTransition(current => {
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
      <div>
        <p>{current.context.count}</p>
        <button onClick={() => send(Events.DECREMENT)}>-</button>
        <button onClick={() => send(Events.INCREMENT)}>+</button>
      </div>
    );
  }
}
