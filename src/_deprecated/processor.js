
//---------------------------------------------
import * as fileio from './fileIO';
const pluralize = require('pluralize');
const path = require('path');
const { app } = require('electron').remote;
//---------------------------------------------

export function namespaceReplace(text, value) {
  text = text.replace(/\[\[namespace\]\]/gi, value);
  return text;
}

//------------------------------------------
export function objectReplace(text, value) {
  text = text.replace(/\[\[object\]\]/gi, value);
  text = text.replace(/\{\[object\]\}/gi, pluralize.plural(value));
  text = text.replace(/\[\|object\|\]/gi, value.toLowerCase());
  text = text.replace(/\{\|object\|\}/gi, pluralize.plural(value.toLowerCase()));
  return text; 
}

//------------------------------------------
export function findIndent(text, match) {
  let lines = text.split(/\r/g);
  for(let i=0; i < lines.length; i++) {
    if(lines[i].indexOf(match)>0) {
      let spacing = lines[i].split(match);
      return spacing[0];
    }
  }
}

//------------------------------------------
export function blockReplace(text, values) {

  let blocks = text.match(/\|\*\*\|/gi);

  for(let i=0;i<blocks.length;i++) {
    values.forEach(value => {
      let text = blocks[i];
      objectReplace(text, value);
    });
  }
 
}

//------------------------------------------
export function propsReplace(text, props) {
  //-------------------
  let spacing = findIndent(text, '[[props]]');
  let propBlock = "";
  //-------------------
  props.forEach((item, index) => {

    if(index>0) { propBlock += '\r\n' + spacing; }

    if(item.attrs) { propBlock += `[${item.attrs}]` }

    if(index==0 && !item.attrs) { 
      propBlock += '';
    }else {
      propBlock += spacing;
    }
    propBlock += `public ${item.type} ${item.prop} { get; set;}`

  })
  text = text.replace(/\[\[props\]\]/gi, propBlock);
  return text;
}


//------------------------------------------
export function getTemplateFile(proc) {
  let template = proc.templates.find(tmp => {
    return tmp.id == proc.templateId;
  })

  let templateFilePath = path.join(app.getAppPath(), 'data', proc.name, template.file)
  let text = fileio.readFile(templateFilePath);
  return text;
}

//===========================================================  Template Processors

export function transformEntity(text, objectDef, config) {
  text = namespaceReplace(text, config.namespace);
  text = objectReplace(text, objectDef.name);
  text = propsReplace(text, objectDef.props);
  return text;
}
export function transformController(text, objectDef, config) {
  text = namespaceReplace(text, config.namespace);
  text = objectReplace(text, objectDef.name);
  return text;
}





//===========================================================  Build

export function buildProject(project) {  

  fileio.getObjectDefinitions(project.inputPath).then((schema) => {     
    project.processors.forEach(proc => {
      switch(proc.processor) {
        case "entity": buildEntities(schema, proc, project);
          break;
        case "controller": buildControllers(schema, proc, project);
          break;
      }
    });
  }, err => { console.error(err) });

}


//-------------------------------------------------------
export function buildEntities(schema, proc, project) {

  let text = getTemplateFile(proc);

  schema.forEach(schemaItem => {
    let filePath = path.join(proc.outputPath,  schemaItem.name +".cs");
    let fileContent = transformEntity(text, schemaItem, project.props);
    console.log(fileContent);
    fileio.writeFile(filePath, fileContent);  
  });

}


//-------------------------------------------------------
export function buildControllers(schema, proc, project) {

  let text = getTemplateFile(proc);

  schema.forEach(schemaItem => {
    let filePath = path.join(proc.outputPath,  schemaItem.name +".cs");
    let fileContent = transformController(text, schemaItem, project.props);
    fileio.writeFile(filePath, fileContent);  
  });

}