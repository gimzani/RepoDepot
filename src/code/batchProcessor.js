//-----------------------------------------------------------------
import * as fileIO from '../code/fileIO'
import * as mergeTags from './mergeTags'
import { reserved } from './constants'
import pluralize from 'pluralize'
const path = require('path');
//-----------------------------------------------------------------

export default class BatchProcessor {

  constructor() {
    this.objectDefs = null;
    this.project = null;
    this.reserved = reserved;
  }
  
  //-----------------------------------------------------------------
  build(project) {
    // get source files
    this.project = project;

    return fileIO.getObjectDefinitions(this.project.inputPath).then(objectDefs => {
      this.objectDefs = objectDefs;
      //console.log("this.objectDefs", this.objectDefs);

      // for each job...
      this.project.jobs.forEach(job => {
        //console.log(job);
        
        fileIO.checkDirectory(job.outputPath);

        // handle single/multiple file process
        if(job.multifile) {
          this.multipleFile(job);
        } else {
          this.singleFile(job);
        }

        if(job.companions.length > 0) {
          // process companion files
          job.companions.forEach(com => {
            this.copyCompanion(com, job);
          });
        }

      });

    });

  }

  //-----------------------------------------------------------------
  multipleFile(job) {
    this.objectDefs.forEach(def => {
      this.singleFile(job, def);
    });
  }

  //-----------------------------------------------------------------
  singleFile(job, def) {
    
    let text = job.content;

    let tags = mergeTags.getAllTags(text);
    //console.log(tags);

    tags.forEach(tag => {
      //console.log(tag);
      text = this.mergeText(tag, text, def);
    });

    let outputPath = '';
    if(def) {
      outputPath = path.join(job.outputPath, def.name + job.fileAppend);
    } else {
      outputPath = path.join(job.outputPath, job.fileAppend);
    }

    //console.log(outputPath, text);
    fileIO.writeFile(outputPath, text);  //save

  }

  //-----------------------------------------------------------------
  //  merge operations
  //-----------------------------------------------------------------

  mergeText(tag, text, def) {

    //console.log(tag, def);

    if(this.reserved.indexOf(tag) < 0) {
      let regex = new RegExp(`\\[\\[${tag}\\]\\]`, 'gi');
      return text.replace(regex, this.project.props[tag]);
    } else {
      switch (tag) {
        case "object": return this.objectReplace(text, def.name);
        case "entity-props": return this.entityProps(text, def.props);
        case "view-model-props": return this.viewModelProps(text, def.props);
        case "context-props": return this.dataContextProps(text);
        case "context-schema": return this.dataContextSchema(text);
        case "uow-repos": return this.uowRepos(text);
        case "uow-instances": return this.uowInstances(text);
        case "iuow-instances": return this.iUowInstances(text);
        case "js-props": return this.jsProps(text, def.props);
        case "js-options": return this.jsOptions(text, def.props);
        case "sql-props": return this.sqlProps(text);
      }
    }
  }

  //------------------------------------------
  objectReplace(text, value) {
    text = text.replace(/\[\[object\]\]/gi, value);
    text = text.replace(/\{\[object\]\}/gi, pluralize.plural(value));
    text = text.replace(/\[\|object\|\]/gi, value.toLowerCase());
    text = text.replace(/\{\|object\|\}/gi, pluralize.plural(value.toLowerCase()));
    return text; 
  }

  //------------------------------------------
  findIndent(text, match) {
    let lines = text.split(/\r\n/g);
    for(let i=0; i < lines.length; i++) {
      if(lines[i].indexOf(match) > 0) {
        let spacing = lines[i].split(match);
        return spacing[0];
      }
    }
  }

  // TODO: find a way to extract a sub-template...

  // found it: \[\[item-name\]\].*\[\[\/item-name\]\]

  //------------------------------------------
  entityProps(text, props) {
    //-------------------
    let spacing = this.findIndent(text, '[[entity-props]]');
    let propBlock = "";
    //-------------------
    props.forEach((item, index) => {

      if(index>0) { propBlock += '\r\n'; }

      if(index === 0 && item.attrs) { 
        propBlock += `[${item.attrs}]\r\n`
    
      } else if (item.attrs) {
        propBlock += spacing + `[${item.attrs}]\r\n`
      }

      propBlock += spacing + `public ${item.type} ${item.prop} { get; set;}\r\n`

    })
    text = text.replace(/\[\[entity-props\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  viewModelProps(text, props) {
    //-------------------
    let spacing = this.findIndent(text, '[[view-model-props]]');
    let propBlock = "";
    //-------------------
    props.forEach((item, index) => {

      if(index>0) { propBlock += '\r\n'; }

      if(index === 0 && item.attrs) { 
        propBlock += `[${item.attrs}]\r\n`
    
      } else if (item.attrs) {
        propBlock += spacing + `[${item.attrs}]\r\n`
      }

      propBlock += spacing + `public ${item.type} ${item.prop} { get; set;}\r\n`

    })
    text = text.replace(/\[\[view-model-props\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  dataContextProps(text) {
    //-------------------
    let spacing = this.findIndent(text, '[[context-props]]');
    let propBlock = "";
    //-------------------
    this.objectDefs.forEach((item, index) => {
      
      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }

      propBlock += `public DbSet<${item.name}> ${pluralize.plural(item.name)} { get; set;}`

    })
    text = text.replace(/\[\[context-props\]\]/gi, propBlock);
    return text;
  }


  dataContextSchema(text) {
    //-------------------
    let spacing = this.findIndent(text, '[[context-schema]]');
    let propBlock = "";
    //-------------------
    this.objectDefs.forEach((item, index) => {
      
      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }
      
      propBlock += `modelBuilder.Entity<${item.name}>().ToTable("${pluralize.plural(item.name)}", schema: "dbo");`

    })
    text = text.replace(/\[\[context-schema\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  uowRepos(text) {
    //-------------------
    let spacing = this.findIndent(text, '[[uow-repos]]');
    let propBlock = "";
    //-------------------
    this.objectDefs.forEach((item, index) => {
      
      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }
      
      propBlock += `public ${item.name}Repository ${pluralize.plural(item.name)} { get; set;}`;

    })
    text = text.replace(/\[\[uow-repos\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  uowInstances(text) {
    //-------------------
    let spacing = this.findIndent(text, '[[uow-instances]]');
    let propBlock = "";
    //-------------------
    this.objectDefs.forEach((item, index) => {

      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }
      
      propBlock += `${pluralize.plural(item.name)} = new ${item.name}Repository(db);`;

    })
    text = text.replace(/\[\[uow-instances\]\]/gi, propBlock);
    return text;
  }
  //------------------------------------------
  iUowInstances(text) {
    //-------------------
    let spacing = this.findIndent(text, '[[iuow-instances]]');
    let propBlock = "";
    //-------------------
    this.objectDefs.forEach((item, index) => {

      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }
      
      propBlock += `${item.name}Repository ${pluralize.plural(item.name)} { get; }`;

    })
    text = text.replace(/\[\[iuow-instances\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  // js
  //------------------------------------------

  //------------------------------------------
  jsProps(text, props) {
    //-------------------
    let spacing = this.findIndent(text, '[[js-props]]');
    let propBlock = "";
    //-------------------
    props.forEach((item, index) => {

      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }

      propBlock += `this.${item.prop} = null;`

    })
    text = text.replace(/\[\[js-props\]\]/gi, propBlock);
    return text;
  }

  //------------------------------------------
  jsOptions(text, props) {
    //-------------------
    let spacing = this.findIndent(text, '[[js-options]]');
    let propBlock = "";
    //-------------------
    props.forEach((item, index) => {

      if(index===0) {
        propBlock += ''; 
      }else {
        propBlock += '\r\n' + spacing; 
      }
      
      propBlock += `this.${item.prop} = options.${item.prop} || this.${item.prop};`

    })
    text = text.replace(/\[\[js-options\]\]/gi, propBlock);
    return text;
  }

  //-----------------------------------------------------------------
  //  companion operations
  //-----------------------------------------------------------------

  copyCompanion(com, job) {
    
    let text = com.content;
    let tags = mergeTags.getAllTags(text);
    let outputPath = path.join(job.outputPath, com.dest);

    tags.forEach(tag => {
      text = this.mergeText(tag, text);
    });

    fileIO.writeFile(outputPath, text);  

  }
  
}