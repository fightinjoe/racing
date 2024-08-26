# v1 Spec
*Aug 8 2024*
This outlines the product requires for the inital version of the Racing app

## Goals
The goals of the v1 version are:
1. ✅ Race committee can easily register a racer
2. Race committee can easily run a race (start, log finishers)
2. Quickly tabulate the scores at the end of the race day

Non-goals include
- Exporting data. It's okay if the data is emailed or uploaded as a JSON blob
- Providing an interface for sailors
- Reviewing data from previous race days

## Features / pages
v1 will only provide the bare level of features for running a race day. It doesn't allow management of any data across multiple race days (i.e. sailors).

### Pages

| Path  | Name          | State variables |
|-------|---------------|-------------|
| **/** | Dashboard     | *Shows scores when racing is complete* |
| **/racers**     | List and add new racers      | racers |
| **/races**      | List races, start a new race | races |
| **/races/{id}** | Specific race, finish racers | races and racers, filter  by {id} |

### Behavior
* **Register users**
  Record a sailor, their sail number, and their fleet. Assign new racers a unique ID
* **Run a race**
  * **Create a Race Day**
    A race day is the core object to which everything else is attached, so it should be created first.
  * **Start a race**
    Once the minimum number of sailors are registered, the first race can be started.
  * **Record finishes**
    Capture the place of different racers finishing
    * Capture DSQs
* **Calculate the score**
  Present the score in an easy to digest fashion

## Data and state
The app needs to work offline. The expectation should be that the app only exchanges data with the server at the beginning and end of a race day. All other data lives in memory and is cached whenever the state changes.

**Zustand** will be used for state management and caching in `localStorage` of the data. Because (1) changes to the data  need to be cached, and (2) the caching methods are exposed via a hook that must be called in a functional component, we *should not create custom classes for our domain objects.* Instead, methods that update cached data should be methods within the Zustand store.

Much of the data model is **relational**. At the point of usage, the data needs to be denormalized (i.e. in the state store), but for storage it should be normalized. To help manage this, there are several paradigms that we'll use:
1. **Types**
   Different types are necessary for normalized and denormalized objects. Since normalized objects most closely map to database tables, they will be suffixed with `*Row`, like `SailorRow`. Denormalized objects will be suffixed with `*Schema`. Types are defined and validated with `Zug`.
2. **Helper methods**
   To ease normalizing / denormalizing the data, there are a few helper functions
   * ```
     participantsFromRows(
       sailorRows: SailorRow[], participantRows: ParticipantRow[]
     ): ParticipantSchema[]
   * ```
     participantsToRows(
      participants: ParticipantSchema[]
     ): { sailors: SailorRow[], participants: ParticipantRow[] }
   * ```
     racesFromRows(
      raceRows: RaceRow[],
      finisherRows: FinisherRow[],
      participantRows: ParticipantRow[],
      sailorRows: SailorRow[]
     ): Map<RaceSchema>
   * ```
     // Assumes that there aren't any changes to participants
     // or sailors.
     racesToRows(races: Map<RaceSchema>):
       { races: RaceRow[], finishers: FinisherRow[] }
3. **Re-rendering**



 To help with this, the following methods will be provided:
* `makeRacers: (SailorSchema[], participants) => Racer[]`



### State and structure
Zustand recommends breaking apart stores for different sets of data to minimize re-renders and complexity.

```
RacerStore
- racers: ParticipantSchema[]
- addRacer: (name: string) => ParticipantSchema

RaceStore
- races: Map<RaceSchema>
- startRace: (fleet: FleetSchema) => RaceSchema
- finishRacer: (racer: ParticipantSchema) => void
- failRacer: (racer: ParticipantSchema) => void
```

### Initial data
Races are initially empty, and racers are loaded from a hard coded config file
* ```const races = new Map()```
* ```const racers = CONFIG.racers```

### Data changes
There are several times when data is written:

| Event | Frequency | Notes |
|:------|-----------|-------|
| When the raceday is created | Once |
| When a new racer is added | ~ 20 times | Maybe hard code racers to start? |
| When a race is started | ~ 10 times |
| When a racer finishes in a race | ~ 10 * 20 times |
| When a race is completed |  ~ 10 times |

To persist the 

### Storing data
All data storage will be done with local storage as one large JSON blob.

### Exporting data
Exported data is stored in a Google Sheet.

## v1.1 Fast Follow Features
1. Load sailors from Google Sheet
1. Sailor autocomplete
2. Track volunteers
3. Track weather

## v2 Features
1. Sailor sign up
2. View previous days of racing
3. View season scores