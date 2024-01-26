# utils

Javascript functions that are useful to be re-used

# usage

    `npm i @leonardorick/utils`

#### on plain javascript

    `import utils from './node_modules/@leonardorick/utils/index.js';`

#### on a modern JS application working with bundlers

    `import utils from '@leoanrdorick/utils';`

### publish

    `npm run build`

#### add new functions

If you are going to add a new "module" (file) make sure to keep the same structure present on the project. The following three folders should have (almost) the same structure:

1. `src/`
   Where the `.js` file is located and the function is actually implemented. This function should be imported inside `src/index.js`, which is the only file that is not repeated on the other folders.This file abastracts the complexity of the actual `index.js` outside the `src` folder that import stuff from './dist' and we don't want to keep updating it everytime.
2. `tests/`
   Any function should have at least one test for it implementation. Preferably the module will have more than one test per function implement to contemplate multiple scenarios
3. `types/`
   The signature of the exported classes/functions should be present on `types/` as a `.d.ts` file. This file should also be imported on the `types/index.d.ts` so all types of the exported package members can be properly infered by IDE's
