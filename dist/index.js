// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"routes/solid-hass.js":[function(require,module,exports) {
const express = require('express');

const fs = require('fs');

const solidNodeClient = require('solid-node-client');

const SolidFileClient = require('solid-file-client');

const router = express.Router();
/* idp: 'https://broker.pod.inrupt.com', // e.g. https://solidcommunity.net
  username: 'iot-solid-bot',
  password: 'kDLpdi!LK2AV84k',
*/

/*
  Another SOLID account:
  krosent
  VtHf5NGuQffE2n7P
*/

router.get('/authorize/:username/:password', async (req, res) => {
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);
  console.log(`username: ${req.params.username}`);
  console.log(`password: ${req.params.password}`);
  await client.login({
    idp: 'https://solidcommunity.net',
    // e.g. https://solidcommunity.net
    username: req.params.username,
    password: req.params.password
  });
  client.getSession().then(session => {
    console.log(session);

    if (session.isLoggedIn) {
      const fileLink = `https://${req.params.username}.solidcommunity.net/automations/automations.yaml`;

      try {
        fileClient.readFile(fileLink).then(fl => {
          if (!fs.existsSync(`/home/krosent/Projects/hass/core/config/${req.params.username}.yaml`)) {
            fs.writeFile(`/home/krosent/Projects/hass/core/config/${req.params.username}.yaml`, fl, {
              flag: 'a+'
            }, automationFileError => {
              if (automationFileError) {
                console.error(automationFileError);
                return;
              } // file written successfully


              console.log(`automations.file for user ${req.params.username} was created`);
              const includeNewAutomationsFile = `automation ${req.params.username}: !include ${req.params.username}.yaml\r\n`;
              fs.writeFile('/home/krosent/Projects/hass/core/config/configuration.yaml', includeNewAutomationsFile, {
                flag: 'a+'
              }, configFileError => {
                if (configFileError) {
                  console.error(configFileError);
                  return;
                }

                console.log(`automations.file for user ${req.params.username} was added to configuration.yaml`);
              });
            });
          }
        });
      } catch (err) {
        console.log(`error is: ${err}`);
      }

      res.status(200).send('Authorized');
    } else {
      res.status(405).send('Unauthorized');
    }
  }).catch(error => res.status(405).send(`Unauthorized, error: ${error}`));
});
router.get('/automations/fetch', async (_, res) => {
  // https://iot-solid-bot.solidcommunity.net/automations/automations.yaml
  const client = new solidNodeClient.SolidNodeClient();
  const fileClient = new SolidFileClient(client);
  const fileLink = 'https://iot-solid-bot.solidcommunity.net/automations/automations.yaml';

  try {
    const file = await fileClient.readFile(fileLink);
    res.write(file, 'binary');
    res.end();
  } catch (err) {
    console.log(`error is: ${err}`);
  }
});
module.exports = router;
},{}],"app.js":[function(require,module,exports) {
/* eslint-disable no-console */
const express = require('express');

const app = express();

const path = require('path');

app.set('view engine', 'ejs'); // import dependencies for frontend

app.use('/css', express.static(path.join('./', 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join('./', 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join('./', 'node_modules/jquery/dist')));
app.use('/popper', express.static(path.join('./', 'node_modules/@popperjs/core/dist')));
app.use('/vis-timeline', express.static(path.join('./', 'node_modules/vis-timeline'))); // dashboard main page

app.get('/', (req, res) => {
  res.render('pages/index');
}); // solid auth routes

const solidHass = require('./routes/solid-hass'); // …


app.use('/', solidHass);
module.exports = app;
},{"./routes/solid-hass":"routes/solid-hass.js"}],"index.js":[function(require,module,exports) {
const app = require('./app');

const port = '8888';
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
},{"./app":"app.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map