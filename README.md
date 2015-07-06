# locator-image-utility
Utility module for providing useful operations regarding handling images.

### Install
include it in your project

```Bash
npm install locator-image-utility
```

### Usage

#### Regex
```js
// access various regexes
var regex = require('locator-image-utility').regex

regex.imageContentType.match('image/png') // or jpg/jpeg

regex.imageExtension.match('png') //or jpg/jpeg

regex.routePrefix.match('/api/v1/trips/') // everything within four slashes
```

#### Validation
```js
// get the validation
var validation = require('locator-image-utility').validation

    // route with image payload
    ...
    payload: validation.basicImageSchema,
    ...

```

#### Image Processing
```js
// create a image processing unit
var imageUtil = require('locator-image-utility').image

    // route with image payload
    ...
    var imageProcessor = imageUtil.processor(request); // request must be a request object from hapi
    
    // will return a useful object containing information about the file
    file = imageProcessor.createFileInformation(nameOfFile);
    
    // will return an object used for saving the picture to couchdb
    imageProcessor.getAttachmentData(file.filename); 
    
    // will crop the stream according to the values in the **request**. The parameters are used for resizing
    stream = imageProcessor.createCroppedStream(100, 100); 
    
    stream.pipe(someStreamFromDatabase);
    ...

```

#### Sizes
The following sizes are used to request a picture with the query ```?size=````
```
 - max:
    size: { x: 1400, y: 819}
    name: 'max'
 - mid :
    size: {x: 700, y: 410}
    name: 'mid'

 - small:
    size: {x: 400,y: 234}
    name: 'small'

 - user:
    size: {x: 150,y: 150}
    name: 'user'

 - userThumb:
    size: {x: 30,y: 30},
    name: 'userThumb'

```
