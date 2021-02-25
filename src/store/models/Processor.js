export default class Processor {
  constructor(options) {

    this.name = null;
    this.type = null;
    this.multifile = null;
    this.description = null;
    this.destFolder = null;
    this.outputPath = null;
    this.templateId = null;
    this.fileAppend = null;
    this.templates = null;

    if(options) {
      this.init();
    }
  }

  init(options) {

    this.name = options.name || this.name;
    this.type = options.type || this.type;
    this.multifile = options.multifile || this.multifile;
    this.description = options.description || this.description;
    this.destFolder = options.destFolder || this.destFolder;
    this.outputPath = options.outputPath || this.outputPath;
    this.templateId = options.templateId || this.templateId;
    this.fileAppend = options.fileAppend || this.fileAppend;
    this.templates = options.templates || this.templates;

  }
}