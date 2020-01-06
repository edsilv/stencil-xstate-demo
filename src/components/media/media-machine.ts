import { Machine, State } from "xstate";

export enum Events {
  START = "START",
  PLAY = "PLAY",
  PAUSE = "PAUSE"
}

// The hierarchical (recursive) schema for the states
export interface MediaStateSchema {
  current: State<MediaContext, MediaEvent, MediaStateSchema>,
  states?: {
    ready: {},
    active: {}
  }
}

// The events that the machine handles
export type MediaEvent =
  | { type: Events.START }
  | { type: Events.PLAY }
  | { type: Events.PAUSE };

// The context (extended state) of the machine
export interface MediaContext {

}

// Activities
const createPlayingActivity = (ctx, _activity) => {
  const interval = setInterval(() => {
    //console.log("playing!");
  }, ctx.interval);

  return () => clearInterval(interval);
}

export const mediaMachine = Machine<MediaContext, MediaStateSchema, MediaEvent>({
  id: "media",
  initial: "ready",
  context: {
    interval: 1000/60
  },
  states: {
    ready: {
      on: {
        START: { target: "active.paused" }
      }
    },
    active: {
      on: {
        PLAY: {
          target: ".playing"
        },
        PAUSE: {
          target: ".paused"
        }
      },
      states: {
        playing: {
          entry: "play",
          activities: "playing",
          on: {
            PAUSE: {
              target: "paused"
            }
          }
        },
        paused: {
          entry: "pause",
          on: {
            PLAY: {
              target: "playing"
            }
          }
        }
      }
    }
  }
},
{
  activities: {
    playing: createPlayingActivity
  }
});
