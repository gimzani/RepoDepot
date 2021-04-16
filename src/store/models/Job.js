
export default class Job {
  constructor(options) {

    this.id = Math.random();
    this.processorId = null;
    this.templateId = null;
    this.name = null;
    this.type = null;
    this.multifile = false;
    this.content = null;
    this.outputPath = null;
    this.fileAppend = null;
    this.companions = [];

    if(options) {
      this.init(options);
    }

  }

  init(options) {
    
    this.id = options.id || this.id;
    this.processorId = options.processorId || this.processorId;
    this.templateId = options.templateId || this.templateId;
    this.name = options.name || this.name;
    this.type = options.type || this.type;
    this.multifile = options.multifile || this.multifile;
    this.content = options.content || this.content;
    this.outputPath = options.outputPath || this.outputPath;
    this.fileAppend = options.fileAppend || this.fileAppend;
    this.companions = options.companions || this.companions;
  
  } 

}