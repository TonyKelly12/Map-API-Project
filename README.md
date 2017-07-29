# What's Tonights Move

-   "Whats Tonights Move" is a google maps api based project, written in javascript, Knockout JS, NodeJS, MongoDB, Mongoose and PassportJs. 

-	This applications login system is written in NodeJS and validated with PassportJS. Users and user favorite locations saved in a Mongo database.

-	This application gives the user the ability to mark their current location, search for locations within a user specified distance of the marked location, and also save & delete thoes locations in their favorite locations list. 

# Installation

- Install NodeJS @ https://nodejs.org/en/
    - https://www.youtube.com/watch?v=1US-P13yKVs

- Install MongoDB @ https://www.mongodb.com/download-center#community
    - https://www.youtube.com/watch?v=_RQ4lET5ejw

- git clone https://github.com/TonyKelly12/Map-API-Project.git

- Type **_npm install_** in the command line to install the package.json file

- Once MongoDB is installed and configured, open command shell and enter **_mongod_** to start mongo server

- Once MongoDB server is running **DO NOT CLOSE SHELL**. Open another shell and enter **_mongo_** to connect your mongo database to the mongo server.

- Once both mongo server and mongo databse are running **DO NOT CLOSE EITHER SHELL** open another shell and enter **_npm start_** to start your development server listening on _port 8000_

# Usage
- On first startup you will be promted to create a login user name and password.

- Once account is created you can log in to the site and viste 3 pages
    - Dashboard
    - Maps
    - Favorite Places

- On the map page start by marking your current location _(Within Louisville, KY)_ at the top of the maps options bar.

- Once current location is set you may search for locations such as banks, restaurants, and hotels.

- Narrow that search down to a certian distance calculated by time and mode of transportation.

- Get routes to thoes locations.

- Save Locations in your favorite locations list.

# Known Issues/Bugs



- _7/24/2017_ Favorite Locations picture on the Dashboard/index page will not populate due to bug in favorite locations array  
    - (**_working on a fix_**) 

- _7/24/2017_ Initial Place search does not stay confined to initial city.  
    - (**_working on a fix_**) 

- _7/24/2017_ Hide and show listings buttons in the map options bar bring up hardcoded data from test array.  
    - (**_working on a fix_**) 