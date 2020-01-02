import { Machine, State, assign } from "xstate";

export enum Events {
  START = "START",
  TOGGLE = "TOGGLE",
  CHECK = "CHECK",
  UNCHECK = "UNCHECK"
}

export type ToggleStateSchema = {
  current: State<ToggleContext, ToggleEvent, ToggleStateSchema>,
  states?: {
    ready: {},
    unchecked: {},
    checked: {}
  }
}

// The events that the machine handles
export type ToggleEvent =
  | { type: Events.START }
  | { type: Events.TOGGLE }
  | { type: Events.CHECK }
  | { type: Events.UNCHECK };

// The context (extended state) of the machine
export type ToggleContext = {
  checked: boolean;
}

// Actions
const check = assign({
  checked: true
});

const uncheck = assign({
  checked: false
});

// Guards
const isNotChecked = ctx => !ctx.checked;
const isChecked = ctx => ctx.checked;

export const toggleMachine = Machine<ToggleContext, ToggleStateSchema, ToggleEvent>({
  id: "toggle",
  initial: "ready",
  context: {
    checked: false
  },
  states: {
    "ready": {
      on: {
        // checks the initial context and transitions to the corresponding state
        [Events.START]: [
          { target: "unchecked", cond: isNotChecked },
          { target: "checked", cond: isChecked }
        ]
      }
    },
    "unchecked": {
      entry: uncheck,
      on: {
        [Events.TOGGLE]: {
          target: "checked"
        }
     }
    },
    "checked": {
      entry: check,
      on: {
        [Events.TOGGLE]: {
          target: "unchecked"
        }
      }
    }
  },
  on: {
    [Events.CHECK]: {
      target: "checked"
    },
    [Events.UNCHECK]: {
      target: "unchecked"
    }
 }
});
