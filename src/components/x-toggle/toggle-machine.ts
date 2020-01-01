import { Machine, assign } from "xstate";

export enum Events {
  TOGGLE = "TOGGLE",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE"
}

export enum States {
  DISABLED = "disabled",
  ENABLED = "enabled"
}

export enum Actions {
  DISABLE = "disable",
  ENABLE = "enable"
}

// The hierarchical (recursive) schema for the states
export interface ToggleStateSchema {
  states: {
    disabled: {};
    enabled: {};
  };
}

// The events that the machine handles
export type ToggleEvent =
  | { type: Events.TOGGLE }
  | { type: Events.ENABLE }
  | { type: Events.DISABLE };

// The context (extended state) of the machine
export interface ToggleContext {
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
  initial: States.DISABLED,
  context: {
    enabled: false
  },
  states: {
    [States.DISABLED]: {
      entry: Actions.DISABLE,
      on: {
        [Events.TOGGLE]: {
          target: States.ENABLED
        },
        [Events.ENABLE]: {
          target: States.ENABLED
        }
     }
    },
    [States.ENABLED]: {
      entry: Actions.ENABLE,
      on: {
        [Events.TOGGLE]: {
          target: States.DISABLED
        },
        [Events.DISABLE]: {
          target: States.DISABLED
        }
      }
    }
  }
},
{
  actions: { enable, disable }
});
