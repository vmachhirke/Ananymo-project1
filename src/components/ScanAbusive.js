import { useEffect, useState } from "react";
import Filter from "bad-words";
import data from '../assets/dataset/dataset.json';


function ScanAbusive(text){
    const filter = new Filter();
    var words=[]

  data.forEach(
    (i)=>{
     words.push(i)
    }
  )

  filter.addWords(...words);

    if (filter.isProfane(text)) {
    console.log("Text contains abusive language.");
    return true;
} else {
    console.log("Text is clean.");
    return false;
}

}

export default ScanAbusive;