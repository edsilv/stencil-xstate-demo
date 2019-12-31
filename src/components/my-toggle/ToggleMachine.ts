import { Machine } from 'xstate';

// The hierarchical (recursive) schema for the states
interface ToggleStateSchema {
  states: {
    inactive: {};
    active: {};
  };
}

// The events that the machine handles
type ToggleEvent =
  | { type: 'TOGGLE' };

// The context (extended state) of the machine
interface ToggleContext {

}

export const toggleMachine = Machine<ToggleContext, ToggleStateSchema, ToggleEvent>({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: {
      on: { TOGGLE: 'active' }
    },
    active: {
      on: { TOGGLE: 'inactive' }
    }
  }
});
