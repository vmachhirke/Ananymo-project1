import React, { useEffect, useState } from 'react';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
import {
    getDatabase,
    ref,
    get,
    child,
    update,
    onValue,
    set,
  } from "firebase/database";

function Test() {
  const [markdown, setMarkdown] = useState('');

  function handleMarkdownChange(event) {
    setMarkdown(event.target.value);
    
  }


const database=getDatabase();
  const md= ref(database, "markdown");

  const getData = async () => {
  const snapshot = await get(md);
        if (snapshot.exists()) {
          const text = snapshot.val().text;
          console.log(text)
       setMarkdown(text)
    }
}
    useEffect(
        ()=>{
getData();
        },[markdown]
    )

  return (
    <>
    <div>
      {/* <textarea
        value={markdown}
        onChange={handleMarkdownChange}
        placeholder="Enter Markdown here..."
        style={{ width: '100%', height: '200px' }}
      /> */}
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(markdown)) }}
        style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}
      />
    </div>

    <div className="container card p-2 mt-5">
{DOMPurify.sanitize(marked(markdown))}
    </div>
    </>
  );
}

export default Test;
