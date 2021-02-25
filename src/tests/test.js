
const inputPath = 'C:\\temp\\rdTests\\Input';
const entity = 'C:\\temp\\rdTests\\Templates\\entity.cst';
const controller = 'C:\\temp\\rdTests\\Templates\\controller.cst';

const config = {
  namespace: "MyProject"
}

const fs = require('fs');

import * as fileio from '../code/fileIO.js'
import * as processor from '../utils/processor.js'

export function testObjectDefinitions() {
  fileio.getObjectDefinitions(inputPath).then((schema) => {
    console.log(schema);
  });
}


export function testEntityTransform() {
  fileio.getObjectDefinitions(inputPath).then((schema) => {
    let schemaItem = schema[0];

    var text = fs.readFileSync(entity, {encoding: 'utf-8'});
    console.log(text);

    text = processor.entity(text, schemaItem, config);
    console.log(text);

  });
}

export function testControllerTransform() {
  fileio.getObjectDefinitions(inputPath).then((schema) => {
    let schemaItem = schema[0];

    var text = fs.readFileSync(controller, {encoding: 'utf-8'});
    console.log(text);

    text = processor.controller(text, schemaItem, config);
    console.log(text);

  });
}

