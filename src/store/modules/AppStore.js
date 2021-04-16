//---------------------------------------------------
import axios from 'axios'
//---------------------------------------------------

// state
//=============================
const state = {
  processors: [],
  processor: {}
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
      commit('SET_PROCESSOR', res.data[0]); 
    });     
  },
  setProcessorById({state, commit}, processorId) {
    let processor = state.processors.find(p => p.id === processorId);
    commit('SET_PROCESSOR', processor); 
  },
  setProcessor({commit}, processor) {
    commit('SET_PROCESSOR', processor); 
  }
}

// mutations
//====================================================================
const mutations = {

  SET_PROCESSORS(state, processors) {
    state.processors = processors;
  },
  
  SET_PROCESSOR(state, processor) {
    state.processor = processor;
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