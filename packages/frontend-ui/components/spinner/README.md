# Spinner

This component can be imported to be displayed before the page loads. Currently the logic has been set up to **display** the spinner.

Should you need to ensure it displays before the page renders any data, this should be done within the app.

## Timer

The timer is set to two seconds and this is done in the route. There is a file called `api.njk` and this binds the data attributes that are needed for the script to be run.

```njk
{% extends "layouts/main.njk" %}

{% set url = "/api" %}

{% block content %}
  <div id="spinner-container"
     data-initial-heading="Initial heading text"
     data-initial-spinnerStateText="Initial spinner state text"
     data-initial-spinnerState="pending"
     data-error-heading="Error heading"
     data-error-messageText="Error message text"
     data-error-whatYouCanDo-heading="Error what you can do heading"
     data-error-whatYouCanDo-message-text1="Error what you can do message text1"
     data-error-whatYouCanDo-message-link-href="Error what you can do message link href"
     data-error-whatYouCanDo-message-link-text="Error what you can do message link text"
     data-error-whatYouCanDo-message-text2="Error what you can do message link text2"
     data-complete-spinnerState="complete"
     data-longWait-spinnerStateText="Long wait spinner state">
  </div>

{% endblock %}

{% block pageScripts %}

{% endblock %}


```

## Scripts

The script finds the DOM element of the ID `spinner-container` and then runs the animation, it has the flexibility for an error state to be handled or for spinner to take longer/shorter.

Within the frontend-ui package, this script is bundled within `frontend-src`, so that it can be used in the alpha-app.

Please note that in the `package.json` file of the frontend-ui repo the files needed for the spinner are exported as follows:

```json
 "exports": {
    ".": {
      "import": "./build/esm/index.js",
      "require": "./build/cjs/index.cjs"
    },
    "./frontend": {
      "import": "./build/esm/index-fe.js",
      "require": "./build/cjs/index-fe.cjs"
    }
  },
```

The default import is at the top and the one at the bottom ensures, the correct script files are ported when the package is built.

Configurations to the alpha-app have also been made to ensure these script files work accordingly however this should not affect any users wanting to use the spinner component from the frontend-ui package.

## Routes

The way testing is done for visual purposes of the components within the frontend-ui package is through the alpha-app.

The routes are set with Express and it is important to note, this route setting is important within the user's application to ensure the spinner works effectively.

```js
let counter = 0;

app.get("/api", (req, res) => {
  counter++;
  const processingTime = req.query.processingTime || 1;
  console.log(
    `Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`,
  );
  if (counter >= processingTime) {
    res.json({ status: "Clear to proceed", counter: counter });
    counter = 0;
  } else {
    res.json({ status: "Still processing", counter: counter });
  }
});
```

This block of code is used **before** any middleware is set, to ensure the params at the end of the route can be captured. This is also helpful as usually the spinner is the first thing to render, whilst the page waits for data to be loaded.

There is a counter set here and within `template.njk` the url sets the processing time (defaulted to 2 currently).

```njk
{% block content %}

{% set url = "/api?processingTime=2" %}


<div id="spinner-container" data-api-route="{{ url }}">

</div>

{% endblock %}
```

It is important that the url is set and the page uses the correct ID.
