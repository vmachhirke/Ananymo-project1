import {marked} from 'marked';
import DOMPurify from 'dompurify';


function MarkdownRender(markdown) {

  return (DOMPurify.sanitize(marked(markdown)));
}

export default MarkdownRender;
