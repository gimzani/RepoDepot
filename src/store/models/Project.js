
//---------------------------------------------------------------------------
import Job from './Job'
import * as mergeTags from '../../code/mergeTags'
//---------------------------------------------------------------------------

export default class Project {
  constructor(options) {

    this.filePath = null;
    this.inputPath = null;
    this.outputPath = null;

    this.jobs = [];

    if(options) {
      this.init(options);
    }
  }

  //---------------------------------------------------------------------------
  init(options) {

    this.filePath = options.filePath || this.filePath;
    this.inputPath = options.inputPath || this.inputPath;
    this.outputPath = options.outputPath || this.outputPath;
    this.jobs = options.jobs ? options.jobs.map(p => new Job(p)) : this.jobs;

  }
  
  //---------------------------------------------------------------------------  
}