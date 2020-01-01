import { Machine, assign, State } from "xstate";

export enum Events {
  INCREMENT = "increment",
  DECREMENT = "decrement"
}

// The hierarchical (recursive) schema for the states
export interface CounterStateSchema {
  current: State<CounterContext, CounterEvent, CounterStateSchema>,
  states?: {
    active: {}
  }
}

// The events that the machine handles
export type CounterEvent =
  | { type: Events.INCREMENT }
  | { type: Events.DECREMENT };

// The context (extended state) of the machine
export interface CounterContext {
  count: number;
  maximum: number;
  minimum: number;
}

// Actions
// couldn't get any combination of outside functions to work...
// const increment = context => context.count + 1;
// const decrement = context => context.count - 1;
// const increment = assign({ count: context => context.count + 1 });
// const decrement = assign({ count: context => context.count - 1 });

// Guards
const isNotMax = context => context.count < context.maximum;
const isNotMin = context => context.count > context.minimum;

export const counterMachine = Machine<CounterContext, CounterStateSchema, CounterEvent>({
  id: "count",
  initial: "active",
  context: {
    count: 0,
    maximum: 10,
    minimum: 0
  },
  states: {
    "active": {
      on: {
        [Events.INCREMENT]: {
          actions: assign({count: context => context.count + 1}),
          cond: isNotMax
        },
        [Events.DECREMENT]: {
          actions: assign({count: context => context.count - 1}),
          cond: isNotMin
        }
      }
    }
  }
});
