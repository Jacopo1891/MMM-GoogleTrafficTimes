# Module: Google Traffic Times

A module for the MagicMirror that displays driving times from a location to one or more destinations based on Google Maps Traffic information. As it uses the times in traffic the values are dynamic as long as there is reasonaby accurate traffic detail available to Google in your area.
If the in traffic travel time is longer then a symbol will be showed.

# Table of contents

- [Installation](#installation)
- [Using the module](#using-the-module)
- [Google API Key](#google-api-key)
- [Offset Time](#offset-time)
- [Schedules](#schedules)
- [Debug](#debug)
- [Example Screenshot](#example-screenshot)
- [Suggestions](#suggestions)
- [Buy me a coffee](#buy-me-a-coffee)
- [Star History](#star-history)

# Installation

Navigate into your MagicMirror's ~/MagicMirror/modules folder and execute

```bash
git clone https://github.com/Jacopo1891/MMM-GoogleTrafficTimes.git
```

A new folder will be created, please navigate into it. Once in ~/MagicMirror/modules/MMM-GoogleTrafficTimes run:

```bash
npm install
```

to install the module and dependencies.

# Using the module

To use this module, add it to the modules array in the config/config.js file:

```JavaScript
var config = {
    modules: [{
        module: 'MMM-GoogleTrafficTimes',
        position: 'top_left',
        config: {
            key: 'YOUR_KEY',
            origin: {
                address: 'SW1A 1AA',
                addressFormat: 'address',
            },
            destinations: [{
                    name: 'Work',
                    address: 'SW1A 2PW',
                    addressFormat: 'address',
                    mode: 'drive',
                    avoidHighways: true,
                    avoidTolls: true,
                    schedules: [],
                    showDestinationOutsideScheduleWithoutTraffic: true
                },
                {
                    name: 'Work Highways',
                    address: 'SW1A 2PW',
                    addressFormat: 'address',
                    mode: 'drive',
                    avoidHighways: false,
                    avoidTolls: false,
                    schedules: [],
                    showDestinationOutsideScheduleWithoutTraffic: false
                },
                {
                    name: 'Gym',
                    address: 'xx.xxxxxx,xx.xxxxxx',
                    addressFormat: 'coordinates',
                    mode: 'walk',
                    schedules: [],
                    showDestinationOutsideScheduleWithoutTraffic: false
                },
                {
                    name: 'Gym 2',
                    address: 'xx.xxxxxx,xx.xxxxxx',
                    addressFormat: 'coordinates',
                    mode: 'bicycle',
                    schedules: [],
                    showDestinationOutsideScheduleWithoutTraffic: false
                }
            ],
            updateInterval: 900000,
            avoidHighways: false,
            avoidTolls: false,
            avoidFerries: false,
            mode: 'drive',
            language: 'en-EN',
            offsetTimePercentage: 25,
            lastUpdate: true,
            timeLastUpdateWarning: 1,
            horizontalLayout: false,
            debug: false
        },
    }]
}
```

- `key`: Your Google API key as described in the relevant section of this readme
- `origin`: This is the location all travel times to the destinations below will be measured from.
- `addressFormat`: The type of origin: `address` or `coordinates` (latitude,longitude)
- `destinations`: Those are the locations you need travel times to (min 1, max 20).
- `updateInterval`: Time (in milliseconds) before refreshing data. Default: 900000 -> 15 minutes.
- `avoidHighways`: true or false, controls whether Highways are avoided (true) or utilised (false) in routing.
- `avoidTolls`: true or false, controls whether Tolls are avoided (true) or utilised (false) in routing.
- `avoidFerries`: true or false, controls whether Ferries are avoided (true) or utilised (false) in routing.
- `mode`: The mode of transport to use when calculating directions, `drive` (default), `bicycle` or `walk` (requests cycling/walking directions via bicycle paths/pedestrian paths - where available)
- `language`: Set languages, default `en-EN`. (`fr-FR`, `de-DE`, `it-IT`)
- `offsetTimePercentage`: Percentage to decide if there is traffic and show symbol. See paragraph to undestand logic and edit properly.
- `lastUpdate`: true or false, shows a warning message if data is not updated.
- `timeLastUpdateWarning`: Specifies time (in minutes) that have to elapse since last failed data update to display the warning message. (Default 1 minute.)
- `horizontalLayout`: true or false, Organize results on horizonal line. (Default false.)
- `schedules`: parameter accepts an array of objects, each representing a schedule for content display (Default empty -> the module will be displayed at all times)
- `showDestinationOutsideScheduleWithoutTraffic`: true or false, shows the traffic times even if current time not in any schedule ignoring trafic details. (Default false)
- `debug`: true or false, shows logs on console (node_helper -> backend, module -> browser).

The Destinations with full address (Street , City, Country) need to be entered in the form

```javascript
[
  {
    name: "Work",
    address: "SW1A 2PW",
    addressFormat: "address",
    mode: "drive", // default drive - also valid walk or bicycle
    avoidHighways: true, // default false
    avoidTolls: true // default false
    schedules: [], // default empty -> show always
    showDestinationOutsideScheduleWithoutTraffic: false // default false -> follow shedule
  }
];
```

If you like to use coordinates set

```javascript
[
  {
    name: "Work",
    address: "xx.xxxxxx,xx.xxxxxx", //latitude,longitude no space
    addressFormat: "coordinates"
  }
];
```

⚠ Important Note:
Each unique combination of travel mode, highway avoidance, and toll avoidance creates a separate request to the API. If your configuration includes many different variations, this can result in a high number of API calls, potentially increasing costs. Be mindful of this when setting up your destinations to avoid unexpected charges.

The Label `name` appears as the title for each result as shown in the Example Screenshot below.
In this release the origin and destination addresses have been tested across a large number of countries but certainly not all.

# Google API Key

In order to use this module you will need a Google Maps API which is available from the Google GCP console.
You will need to enable the following APIs for your key, Maps JavaScript API, Geocoding API, Distance Matrix API and Routes API.

⚠ Important Note:
Each group of destinations that differs by travel mode, highway avoidance, or toll avoidance generates a separate set of API calls. If there are many variations among your destinations, this can lead to a high number of requests, potentially increasing costs. Please keep this in mind when configuring the module to avoid unexpected charges.

# Offset Time

To determine if the road is busy or not, I decided to add the optimal time (meaning without traffic by Google Matrix) with an offset obtained using this simple formula:
`timeWithoutTraffic + (timeWithoutTraffic * offset/100)`
If the estimated time from Google Matrix is greater than this value, it means there is traffic, and the symbol is displayed.
By default, the offset is set to 25%, which seems like a good compromise.

# Schedules

The schedules parameter accepts an array of objects, each representing a schedule for module display.  
Each object in the list must include the following keys:  
`days`: An array of numbers representing the days of the week to apply the schedule. Day numbers correspond to the following values: 0 (Sunday) to 6 (Saturday). For example, [0, 1, 2, 3, 4] indicates that the schedule applies from Sunday to Thursday.  
`startHH`: The starting hour of the schedule (in 24-hour format).  
`startMM`: The starting minute of the schedule.  
`endHH`: The ending hour of the schedule (in 24-hour format).  
`endMM`: The ending minute of the schedule.  
If the days array is empty, the content will be displayed at all times.

Here's an example of how to configure the schedules parameter:

```javascript
schedules: [
  {
    days: [0, 1, 2, 3, 4], // From Sunday to Thursday
    startHH: "08",
    startMM: "00",
    endHH: "17",
    endMM: "30"
  },
  {
    days: [5], // Friday
    startHH: "08",
    startMM: "30"
  },
  {
    days: [], // Display at all times
    startHH: null,
    startMM: null,
    endHH: null,
    endMM: null
  }
];
```

This example sets up three schedules:  
From Sunday to Thursday, display content from 08:00 to 17:30.  
On Friday, display content from 08:30.  
Display content at all times when the days array is empty.

# Debug

1. Stop any running instance of MagicMirror2.
2. Make sure you are in the main directory of your project.
3. Set `debug: true` on config.js as described in installation section.
4. Execute the following command to start to see all logs.

```bash
npm start dev
```

or

```bash
npm start dev | grep MMM-GoogleTrafficTimes
```

to see only MMM-GoogleTrafficTimes's logs.

# Example Screenshot

- Minimal

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/01-minimal_look.png)

- Default

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/02-default_look.png)

- Multiple

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/03-multiple.png)

- Details (with traffic)

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/04-details.png)

- Warning message update

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/05-last_update.png)

- Horizontal

![alt text](https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/blob/master/screen/06-horizontal_look.png)

# Suggestions

Please feel free to raise an issue on GitHub for any features you would like to see or usage issues you experience and I will endeavour to address them.

# Buy me a coffee

Find it useful? Please consider buying me or other contributors a coffee.

<a href="https://www.buymeacoffee.com/jacopo1891d">
<img style="height: 51px; width: 181px; max-width: 100%;" alt="blue-button" src="https://github.com/Jacopo1891/MMM-GoogleTrafficTimes/assets/5861330/43f41b8d-13e5-4711-877d-cab090bc56b0">
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Jacopo1891/MMM-GoogleTrafficTimes&type=Date)](https://www.star-history.com/#Jacopo1891/MMM-GoogleTrafficTimes&Date)
