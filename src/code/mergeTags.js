
//---------------------------------------------------
import { reserved } from './constants'
//---------------------------------------------------

Array.prototype.concatAll = function() {
	var results = [];
	this.forEach(function(subArray) {
		results = results.concat(subArray);
	});
	return results;
};

//----------------------------------------------
//  extract props
//----------------------------------------------
export function getKeys(text) {
  const array = getTags(text);
  let keys = array.filter(item => {
    if(reserved.indexOf(item) < 0) {
      return item;
    }
  });
  return keys;
}

//----------------------------------------------
export function getTags(text) {
  let regexp = /\[\[\w+-*\w*\]\]/g;
  const array = [...text.match(regexp)].map(i => i.replace('[[','').replace(']]',''));
  return array;
}


//----------------------------------------------
export function getAllTags(text) {
  
  let oSingular =  /\[\[\w+-*\w*-*\w*\]\]/g;
  let singularMatch = text.match(oSingular);
  const singular = singularMatch ? [...singularMatch].map(i => i.replace('[[','').replace(']]','')) : [];
    
  let oPlural = /\{\[\w+-*\w*-*\w*\]\}/g;
  let pluralMatch = text.match(oPlural);
  const plural = pluralMatch ? [...pluralMatch].map(i => i.replace('{[','').replace(']}','')) : [];

  let arrays = [];
  arrays = singular ? [ ...arrays, ...singular ] : [];
  arrays = plural ? [ ...arrays, ...plural ] : [];

  return distinctSet(arrays);
}

//----------------------------------------------
export function distinctSet(array) {
  let total = array.concatAll();
  return total.reduce((acc, cur) => {
    if(acc.indexOf(cur.trim())===-1) {
      acc.push(cur.trim());
    } 
    return acc;
  }, []);
}

//----------------------------------------------