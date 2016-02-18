# Artifactory Query Language
To read more about [AQL](https://www.jfrog.com/confluence/display/RTF/Artifactory+Query+Language).

## Set up connection
In order to be able to connect to the server and send request you need to set up
the link to the artifactory. An example for using basic authentication:

```
  var aql = require('aql'),
      username = "fekete.peter",
      password = "lokaki12",
      auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

  // config object is used by the Request class
  aql.config({
        uri: "http://artifactory.mydomain.com/artifactory/api/search/aql",
        headers: {
           Authorization: auth
        }
     });
```

Method in the config by default is `POST`. The default transform function is
`JSON.parse`.


## Build and run your query

```
   var aqlQuery = aql.items.find().include("*").limit(10).sort({$asc: ["repo"]});

   aql.query(aqlQuery.query).then((data) => {
         console.log(data);
      });

   // OR

   aql.query(aqlQuery).then((data) => {
         console.log(data);
      });

```
