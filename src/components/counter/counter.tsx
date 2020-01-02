import { Component, h, State, Prop } from "@stencil/core";
import { interpret, Interpreter } from "xstate";
import { counterMachine, CounterContext, CounterStateSchema, CounterEvent, Events } from "./counter-machine";

@Component({
  tag: "x-counter",
  styleUrl: "counter.css",
  shadow: true
})
export class XCounter {

  @State() state: CounterStateSchema;

  @Prop() count: number;
  @Prop() max: number;
  @Prop() min: number;

  service: Interpreter<CounterContext, CounterStateSchema, CounterEvent>;

  componentWillLoad() {
    this.service = interpret<CounterContext, CounterStateSchema, CounterEvent>(counterMachine.withContext({
      count: this.count,
      max: this.max,
      min: this.min
    })).onTransition(current => {
      console.log(current);
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
      <div>
        <p>{current.context.count}</p>
        <button onClick={() => send(Events.DECREMENT)}>-</button>
        <button onClick={() => send(Events.INCREMENT)}>+</button>
      </div>
    );
  }
}
