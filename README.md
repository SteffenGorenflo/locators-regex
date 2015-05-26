# locator-image-utility
Utility module for providing useful operations regarding handling images.

### Install
include it in your project

```Bash
npm install locator-image-utility
```

### Usage

```
// access various regexes
var regex = require('locator-image-utility').regex

// get the validation
var validation = require('locator-image-utility').validation

// create a image processing unit
var imageUtil = require('locator-image-utility').image
var imageProcessor = imageUtil.processor(request); // request must be a request object from hapi

// perform some operations
```
