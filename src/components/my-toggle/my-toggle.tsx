import { Component, h, State } from '@stencil/core';
import { interpret } from 'xstate';
import { toggleMachine } from './ToggleMachine';

@Component({
  tag: 'my-toggle',
  styleUrl: 'my-toggle.css',
  shadow: true
})
export class MyToggle {

  @State() state: any;

  service = interpret(toggleMachine).onTransition(current =>
    this.state = { current }
  );

  componentDidLoad() {
    this.service.start();
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {

    if (!this.state) {
      return;
    }

    const { current } = this.state;
    const { send } = this.service;

    return (
      <button onClick={() => send('TOGGLE')}>
        {current.matches('inactive') ? 'Off' : 'On'}
      </button>
    );
  }
}
