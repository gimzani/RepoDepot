//---------------------------------------------------------------------
const fs = require('fs');
import ObjectDefinition from '../store/models/ObjectDefinition.js'
const path = require('path');
//---------------------------------------------------------------------

//---------------------------------------------------------------------
export function getObjectDefinitions(inputPath) {
  return new Promise(function (resolve) {
    return readDirectory(inputPath).then(filePaths => {
      return parseFiles(filePaths).then(dataModelSchemas => {
        //console.log("dataModelSchemas?", dataModelSchemas);
        resolve(dataModelSchemas);
      })
    });
  });
}

//------------------------------------------------
export function readDirectory(directoryPath) {
  return new Promise(function (resolve, reject) {
    //--------------------
    var filePaths = [];
    fs.readdir(directoryPath, function (err, items) {
      //--------------------
      if (err)
        reject(err);
      //--------------------
      for (var i = 0; i < items.length; i++) {
        filePaths.push(directoryPath + "\\" + items[i]);
      }
      //--------------------
      resolve(filePaths);
    });
  });
}

//------------------------------------------------
export function parseFiles(filePaths) {
  return new Promise(function (resolve) {
    //--------------------
    var objectDefs = [];
    //--------------------
    for (var i = 0; i < filePaths.length; i++) {
      if(filePaths[i].endsWith(".json")) {
        var objectDef = parseDataModelFile(filePaths[i]);
        objectDefs.push(objectDef);        
      }
    }
    //--------------------
    resolve(objectDefs);
  })
}

//------------------------------------------------
export function parseDataModelFile(filePath) {
  var fileData = fs.readFileSync(filePath);
  var fileName = getFilename(filePath);
  var file = new ObjectDefinition(fileName, fileData);  
  return file;
}

//---------------------------------------
export function getFilename(filePath) {
  var filePathParts = filePath.split('\\');
  var fileName = filePathParts[filePathParts.length-1];
  var fileNameParts = fileName.split('.');
  return fileNameParts[0];
}

//---------------------------------------
export function getFilenameAndExtension(filePath) {
  var filePathParts = filePath.split('\\');
  var fileName = filePathParts[filePathParts.length-1];
  return fileName;
}


//---------------------------------------
export function getTemplateContent(root, folderName, fileName) {
  let templateFilePath = path.join(root, 'data', folderName, fileName);
  let text = readFile(templateFilePath);
  return text;
}

//=====================================================================================

export function checkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function readFile(path) {
  return fs.readFileSync(path, {encoding: 'utf-8'});
}


export function writeFile(path, content) {
  fs.writeFile(path, content, function(err){
    if(err){
      return console.log(err);
    }
  })
}

//=====================================================================================
// --------------------------------------------------
export function saveProject(event, project) {
  let content = JSON.stringify(project);
  fs.writeFile(project.filePath, content, function(err){
    if(err){
      return console.log(err);
    }
    event.sender.send('project-saved', project);
  })
}
// --------------------------------------------------
export function loadProject(event, filePath) {
  fs.readFile(filePath, function(err, data){
    if(err){
      return console.log(err);
    }
    let json = JSON.parse(data);
    event.sender.send('project-loaded', json);
  })
}