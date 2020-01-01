import { Machine, assign, State } from "xstate";

export enum Events {
  TOGGLE = "TOGGLE",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE"
}

export type ToggleStateSchema = {
  current: State<ToggleContext, ToggleEvent, ToggleStateSchema>,
  states?: {
    disabled: {},
    enabled: {}
  }
}

// The events that the machine handles
export type ToggleEvent =
  | { type: Events.TOGGLE }
  | { type: Events.ENABLE }
  | { type: Events.DISABLE };

// The context (extended state) of the machine
export type ToggleContext = {
  enabled: boolean;
}

// Actions
const enable = assign({
  enabled: true
});

const disable = assign({
  enabled: false
});

export const toggleMachine = Machine<ToggleContext, ToggleStateSchema, ToggleEvent>({
  id: "toggle",
  initial: "disabled",
  context: {
    enabled: false
  },
  states: {
    "disabled": {
      entry: disable,
      on: {
        [Events.TOGGLE]: {
          target: "enabled"
        },
        [Events.ENABLE]: {
          target: "enabled"
        }
     }
    },
    "enabled": {
      entry: enable,
      on: {
        [Events.TOGGLE]: {
          target: "disabled"
        },
        [Events.DISABLE]: {
          target: "disabled"
        }
      }
    }
  }
});
