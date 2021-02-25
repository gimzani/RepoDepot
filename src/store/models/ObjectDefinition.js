
//--------------------------------------------------
export default class ObjectDefinition {
  //------------------------------------------
  constructor(name, fileData){
    this.name = name;
    this.props = this.parseProps(fileData);
  }
  //------------------------------------------
  parseProps(fileData){
    //-----------------------------
    let props = [];
    let obj = JSON.parse(fileData);
    let keys = Object.keys(obj);
    //-----------------------------
    keys.forEach(key => {
      //---------------------
      let data = obj[key];
      let dataSplit = data.split(':');
      //---------------------
      props.push({
        prop: key,
        type: dataSplit[0],
        attrs: dataSplit[1] || null
      });
      //---------------------
    })
    return props;
  }
  //------------------------------------------
}
//--------------------------------------------------