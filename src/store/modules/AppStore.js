//---------------------------------------------------
import axios from 'axios'
//---------------------------------------------------

// state
//=============================
const state = {
  processors: []
}

// getters
//=============================
const getters = {
}

// actions
//====================================================================
const actions = {
  init({commit}) {
    axios.get('/data/processors.json').then(res => { 
      //console.log(res);
      commit('SET_PROCESSORS', res.data); 
    });     
  }
}

// mutations
//====================================================================
const mutations = {

  SET_PROCESSORS(state, processors) {
    state.processors = processors;
  }

}

//====================================================================
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}