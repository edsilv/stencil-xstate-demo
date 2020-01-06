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

  private _service: Interpreter<CounterContext, CounterStateSchema, CounterEvent>;

  componentWillLoad() {
    this._service = interpret<CounterContext, CounterStateSchema, CounterEvent>(counterMachine.withContext({
      count: this.count,
      max: this.max,
      min: this.min
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
      <div>
        <p>{current.context.count}</p>
        <button disabled={current.matches("active.min")} onClick={() => send(Events.DEC)}>-</button>
        <button disabled={current.matches("active.max")} onClick={() => send(Events.INC)}>+</button>
      </div>
    );
  }
}
