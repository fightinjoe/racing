# v1 Spec
*Aug 8 2024*
This outlines the product requires for the inital version of the Racing app

## Goals
The goals of the v1 version are:
1. Race committee can easily register a racer
2. Race committee can easily run a race (start, log finishers)
2. Quickly tabulate the scores at the end of the race day

Non-goals include
- Persisting data. It's okay if the data is emailed or uploaded as a JSON blob
- Providing an interface for sailors
- Reviewing data from previous race days

## Features
v1 will only provide the bare level of features for running a race day.

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

## Data and storage
The app needs to work offline. The expectation should be that the app only
exchanges data with the server at the beginning and end of a race day

### Structure
The structure of the data that needs to be stored looks like:
```
Racer
|- Sailor
|  |- id
|  |- name
|- fleet
|- sailNumber
|- note

RaceDay
|- date
|
|- races[]
|  |- fleet
|  |- startTime
|  |- finishers: Racer[]
|  |- notes[]
|
|- config
|  |- combinedFleets
|  |- sailSize
```

### Data location
The data created (e.g. registration of users) needs to be available throughout the app. The data will also need to be easy to manipulate
throughout the app. This will be achieved with Context and Reducers:
1. **racersReducer()**
  Dispatches actions:
    1. **add** - add a new racer
2. **racesReducer()**
  Dispatches actions:
    1. **start** - starts a race
    2. **recordFinish** - records the finish of a racer
    3. **end** - ends the race
3. **RacersContext**
  Exposes Racers state, which is an array of all active racers, and racersDispatch()
4. **RacesContext**
  Exposes Races state, which is an array of all races, and racesDispatch()
  
### Initial data
Races are initially empty, and racers are loaded from a hard coded config file
* ```const races = []```
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