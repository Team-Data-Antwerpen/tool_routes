Tool routes
==========
A web map based on <http://tink.digipolis.be> and <http://openlayers.org> .

Install
------

- install nodejs from <https://nodejs.org/en/download/>
- CMD into the this folder ('tool_routes')
- run the following commmands to download dependencies end compile the code. You might have to run as Administrator. 

>   npm install
>   bower install
>   grunt 
    
After running this, a new **_bower.js** and **_bower.css** file will be created, containing all bower-dependencies, like tink.
If you add new bower dependencies, then have to run grunt again. You do NOT have to add any grunt dependencies to the html page.