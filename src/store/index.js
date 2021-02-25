import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import AppStore from './modules/AppStore'
import ProjectStore from './modules/ProjectStore'

// ---------------------------------------------------------
const store = new Vuex.Store({
  modules:{
    AppStore,
    ProjectStore
  }
});

// ---------------------------------------------------------
export default store