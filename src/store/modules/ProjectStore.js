//---------------------------------------------------
import * as ipc from '../../code/ipc'
import Project from '../models/Project'
//---------------------------------------------------

// state
//=============================
const state = {
  project: null,
  statusMessage: null
}

// getters
//=============================
const getters = {
}

// actions
//====================================================================
const actions = {

  init({commit}) {
    commit("SET_PROJECT", null);
  },

  newProject({commit, dispatch}, path) {
    let project = new Project({filePath: path});
    commit("SET_PROJECT", project);
    dispatch('saveProject');
  },

  loadProject({commit}, path) {    
    ipc.loadProject(path).then(project => { 
      commit("SET_PROJECT", project);
    });
  },

  updateProject({commit, state}, {prop, val}) {
    let project = new Project(state.project);
    project[prop] = val;
    commit("SET_PROJECT", project);
  },

  saveProject({state}) {
    ipc.saveProject(state.project);
  },

  //-------------------------------------------------------

  addJob({state, commit}, job) {
    let project = new Project(state.project);
    project.jobs.push(job);
    commit("SET_PROJECT", project);
  },

  updateJob({state, commit}, job) {
    let project = new Project(state.project);
    let ind = project.jobs.findIndex(j => j.id === job.id);
    project.jobs[ind] = job;
    commit("SET_PROJECT", project);
  },

  removeJob({commit}, job) {
    let project = new Project(state.project);
    project.jobs = state.project.jobs.filter(p => {
      if(p.id !== job.id) { return p }
    });
    commit("SET_PROJECT", project);
  }

}

// mutations
//====================================================================
const mutations = {
  SET_PROJECT(state, project) {

    state.project = project;
    state.statusMessage = null;
    
    if(!project) {
      return;
    } else if(!project.inputPath) {
      state.statusMessage = "You will need an input path and at least one processor in order to build.";
    } else if(!project.outputPath) {
      state.statusMessage = "You will need an output path in order to add job.";
    } else if(project.jobs === 0) {
      state.statusMessage = "You will need at least one processor to build.";
    }

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