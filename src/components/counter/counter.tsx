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

  @Prop() count: number = 0;
  @Prop() max: number = Number.MAX_VALUE;
  @Prop() min: number = 0;

  service: Interpreter<CounterContext, CounterStateSchema, CounterEvent>;

  componentWillLoad() {
    this.service = interpret<CounterContext, CounterStateSchema, CounterEvent>(counterMachine.withContext({
      count: this.count,
      max: this.max,
      min: this.min
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
      <div>
        <p>{current.context.count}</p>
        <button onClick={() => send(Events.DECREMENT)}>-</button>
        <button onClick={() => send(Events.INCREMENT)}>+</button>
      </div>
    );
  }
}
