import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function EditorComponent({content,setContent}) {
  console.log(content)
  return (
    <div className="w-50%  rounded-md bg-transparent px-5 py-3 text-base text-black-900 outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-grey-500"
    // style={{background:"linear-gradient(to bottom,rgba(0, 0, 0, 0.55),rgba(2, 5, 54, 0.48))"}}
    >
      <Editor
        apiKey='xe4ng50aj0nku4shsg7soye4luscr7o9bihw2uiw0dgnj2x6'
        init={{
          height: 750,
          skin: 'oxide-dark',
          content_css: 'dark',
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          uploadcare_public_key: '6bf90cdc795e475a6969',
          
          content_style: `
            /* Style the actual editable area inside the iframe */
            .mce-content-body {
              font-family: 'Inter', sans-serif;
              font-size: 20px;
              line-height: 1.6;
              height: 100%;
              color: #fff;
            //   background:linear-gradient(to right,rgb(10, 5, 1),rgb(1, 3, 39));
              /* Remove any inner container look */
              padding: 10px; /* no inner padding */
              margin: 2px;  /* full width */
              border: none; /* ensure no border */
              border-radius: 0; /* no rounded box */
            }
            .mce-content-body p {
              margin: 0 0 1em;
            }
            .mce-content-body img {
              max-width: 100%;
              height: auto;
            }
          `
        }}
        initialValue={content?content:"Warning : Avoid writing your title twice either in title block or in editor"}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
