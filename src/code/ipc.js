
const ipc = require('electron').ipcRenderer;

// --------------------------------------------------
export function saveProject(project) {
  return new Promise((resolve) => {
    ipc.once('project-saved', (evt, projectData) => {
      console.log('project-saved', evt);
      resolve(projectData);
    });
    ipc.send('save-project', project);
  });
}

// --------------------------------------------------
export function loadProject(filePath) {
  return new Promise((resolve) => {
    ipc.once('project-loaded', (evt, projectData) => {
      console.log('project-loaded', evt);
      resolve(projectData);
    });
    ipc.send('load-project', filePath);
  });
}