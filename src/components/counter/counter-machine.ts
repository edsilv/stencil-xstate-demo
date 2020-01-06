import { Machine, assign, State } from "xstate";

export enum Events {
  START = "START",
  INC = "INC",
  DEC = "DEC"
}

// The hierarchical (recursive) schema for the states
export type CounterStateSchema = {
  current: State<CounterContext, CounterEvent, CounterStateSchema>,
  states?: {
    ready: {},
    active: {}
  }
}

// The events that the machine handles
export type CounterEvent =
  | { type: Events.START }
  | { type: Events.INC }
  | { type: Events.DEC };

// The context (extended state) of the machine
export type CounterContext = {
  count: number;
  min: number;
  max: number;
}

// Actions
// couldn't get any combination of outside functions to work...
// const increment = context => context.count + 1;
// const decrement = context => context.count - 1;
// const increment = assign({ count: ctx => (ctx as CounterContext).count + 1 });
// const decrement = assign({ count: ctx => (ctx as CounterContext).count - 1 });

// Guards
const isMax = ctx => ctx.count === ctx.max;
const isLessThanMax = ctx => ctx.count < ctx.max;
const isMin = ctx => ctx.count === ctx.min;
const isGreaterThanMin = ctx => ctx.count > ctx.min;

export const counterMachine = Machine<CounterContext, CounterStateSchema, CounterEvent>({
  id: "count",
  initial: "ready",
  context: {
    count: 0,
    min: 0,
    max: Number.MAX_VALUE
  },
  states: {
    "ready": {
      on: {
        // checks the initial context and transitions to the corresponding state
        [Events.START]: [
          { target: "active.min" }
        ]
      }
    },
    "active": {
      states: {
        min: {
          on: {
            "": {
              target: "mid",
              cond: isGreaterThanMin
            },
            // disallow decrementing
            DEC: undefined
          }
        },
        mid: {
          on: {
            "": [
              {
                target: "min",
                cond: isMin
              },
              {
                target: "max",
                cond: isMax
              }
            ]
          }
        },
        max: {
          on: {
            "": {
              target: "mid",
              cond: isLessThanMax
            },
            // disallow incrementing
            INC: undefined
          }
        }
      },
      on: {
        INC: { actions: assign({count: ctx => ctx.count + 1}) },
        DEC: { actions: assign({count: ctx => ctx.count - 1}) }
      }
    }
  }
});
