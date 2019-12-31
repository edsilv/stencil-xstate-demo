import { Component, h, State, Prop } from '@stencil/core';
import { interpret } from 'xstate';
import { toggleMachine } from './ToggleMachine';

@Component({
  tag: 'my-toggle',
  styleUrl: 'my-toggle.css',
  shadow: true
})
export class MyToggle {

  @State() state: any;

  @Prop() active: boolean;

  service = interpret(toggleMachine).onTransition(current =>
    this.state = { current }
  );

  componentWillLoad() {
    this.service.start();
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {

    const { current } = this.state;
    const { send } = this.service;

    return (
      <button onClick={() => send('TOGGLE')}>
        {current.matches('inactive') ? 'Off' : 'On'}
      </button>
    );
  }
}
