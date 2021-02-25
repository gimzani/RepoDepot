
import * as fileIO from '../code/fileIO'

export default {

  install(Vue) {

    // --------------------------------------------
    Vue.filter('filename', function (value) {
      if(!value) { return null; }
      return fileIO.getFilename(value);
    });

    // --------------------------------------------
    Vue.filter('filenameExtension', function (value) {
      if(!value) { return null; }
      return fileIO.getFilenameAndExtension(value);
    });
    

  }
}




//-----------------------------------------------------------------
//=================================================================
//-----------------------------------------------------------------

//-----------------------------------------------------------------