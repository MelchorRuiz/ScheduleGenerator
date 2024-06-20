import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import PropTypes from 'prop-types';

function DropZone({ onFileChange }) {
  return (
    <div className="flex items-center justify-center w-1/2">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">XLSX</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={onFileChange} />
      </label>
    </div>
  );
}

DropZone.propTypes = {
  onFileChange: PropTypes.func.isRequired
};

function App() {
  const [data, setData] = useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file.name.endsWith('.xlsx')) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setData(data);
  }

  return (
    <main className='w-screen h-screen bg-slate-500'>
      {
        data ? (
          <div className='flex max-h-full gap-5 p-10'  >
            {
              data.map((item, index) => (
                <div key={index} className='w-1/3 overflow-auto'>
                  <CopyBlock
                    text={JSON.stringify(item, null, 2)}
                    language="json"
                    showLineNumbers
                    wrapLines
                    theme={dracula}
                    codeBlock
                  />
                </div>
              ))
            }
            <button className='absolute bottom-5 right-5 bg-amber-300 text-black p-3 rounded-lg font-semibold'>Nuevo Documento!!</button>
          </div>
          ) : (
          <div className='flex justify-center items-center h-full'>
            <DropZone onFileChange={onFileChange} />
          </div>
        )
      }
    </main>
  );
}

export default App;