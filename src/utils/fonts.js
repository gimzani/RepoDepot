
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronUp,
  faChevronDown,
  faCheck,
  faTimes,
  faEllipsisH,
  faPlay,
  faPlus,
  faFile,
  faFolderOpen,
  faFolder,
  faSave
} from '@fortawesome/free-solid-svg-icons'


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const Fonts = {
  install(Vue) {
    library.add(
      faChevronUp,
      faChevronDown,
      faCheck,
      faTimes,
      faEllipsisH,
      faPlay,
      faPlus,
      faFile,
      faFolderOpen,
      faFolder,
      faSave
    );
    Vue.component('font-awesome-icon', FontAwesomeIcon);
  }
}

export default Fonts;