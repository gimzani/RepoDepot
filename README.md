# RepoDepot


* AddJob -> JobNewEdit
  * Full create of a "Job" from a "Processor" - ( change name of processor? ) : TemplateCollection
  * AddJob to Project on Save

* Build
  * Segment to "Build All" or to "Run Job" for a single item

* add "VueCodeMirror"
* editJobs
* remove "PROPS" fom Jobs and from "Project"


## App

App
 |-- Toolbar
 |-- ProjectDisplay
      |-- [JobDisplay]


* Toolbar
  * (e) New Project
  * (e) Open Project
  * (e) Close Project
  * (e) Save Project
  * (e) New Processor - (Job?)

* ProjectDisplay - (control Panel)


  * List of JobDisplay
      *displays job data*

## App Functions:

* (f) newProject -> "ProjectStore/newProject"
* (f) saveProject -> "ProjectStore/saveProject"
* (f) openProject -> "ProjectStore/loadProject"
* (f) closeProject -> "ProjectStore/init"

* (f) addJob -> "ProjectStore/addJob" - (todo: handle job conversion in Modal)
* (f) removeJob - > "ProjectStore/removeJob"


## Project Display Functions
* (f) setInputPath -> "ProjectStore/updateProject"
* (f) setOutputPath -> "ProjectStore/updateProject"
* (f) setProp -> "ProjectStore/updateProp"  -- deprecating

*Main work is Converting from a Processor to a Job* 



----
[[singular]]

{[plural]}

[|singular-lowercase|] 

{|plural-lowercase|} 