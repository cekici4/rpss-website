const outputDiv = document.getElementById('output');
function createParameterModal() {
	const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
	myModal.toggle();
	console.log('run');
}

async function getContent(endpoint = 'https://rpss:8443/share', type = 0) {
	const response = await fetch(endpoint);
	const responseJSON = await response.json();
	
	switch(type) {
		case 0: // default type (folder)		
		case 1: // folder type
			datasetType = 'folder';
		case 2: // file type
			
			const ListDiv = document.createElement('div');
			ListDiv.setAttribute('id','folderDiv');
			responseJSON.forEach(folder => {
				
				const A = document.createElement('a');
				const fname = folder.fileName;
				A.setAttribute("id", fname);
				A.innerHTML = fname;
				A.href ="#";
				A.dataset.type = folder.fileType;
				A.dataset.url = folder.fileUrl; // Add this line
				
				ListDiv.appendChild(A);
			});
			const fileListDiv = document.getElementById('fileList');
			fileListDiv.innerHTML = ''; // Clear any existing content
			fileListDiv.appendChild(ListDiv);
			
				console.log('file event created');
				fileListDiv.addEventListener('click', async (event) => {
					event.preventDefault(); 
					const target = event.target;
					if (target.dataset.type === 'file') { 
						console.log('ran');
						outputDiv.innerHTML = '';
						const funcPara = document.createElement('div');//
						funcPara.id = "function-params";
						fileListDiv.appendChild(funcPara);
						await getFunctionList("https://rpss:8443"+target.dataset.url+ "/" +target.innerHTML);
					}
				});
				fileListDiv.addEventListener('click', async (event) => {
					event.preventDefault(); 
					const target = event.target;
					if (target.dataset.type === 'folder') { 
						await getContent("https://rpss:8443"+target.dataset.url);
					}
				});

			break;
	}
}

async function getFirstLevelFolders(endpoint = 'https://rpss:8443/share') {
	share.disabled = true;
	try {
		const response = await fetch(endpoint);
		const folderList = await response.json();
		console.log('First level folder list:', folderList);
		const folderListDiv = document.createElement('ul');

		folderList.forEach(folder => {
		  const folderNameLI = document.createElement('li');
		  const folderNameA = document.createElement('a');
		  console.log(folder);

		  folderNameA.innerHTML = folder.fileName;
		  folderNameA.href ="#";
		  folderNameA.dataset.url = folder.folderUrl; // Add this line
		  folderNameLI.appendChild(folderNameA);
		  folderListDiv.appendChild(folderNameLI);
		});

		const fileListDiv = document.getElementById('file-list');
		fileListDiv.innerHTML = ''; // Clear any existing content
		fileListDiv.appendChild(folderListDiv);

		// Add an event listener to the folder list container to handle clicks on folder links
		fileListDiv.addEventListener('click', async (event) => {
		  event.preventDefault(); // prevent the default behavior of the link
		  const target = event.target;
		  if (target.tagName === 'A') { // check if the clicked element is a link
			console.log('Clicked first level folder link:', target.href);
			// Call the getSecondLevelFolders() function when a first level folder link is clicked
			const folderEndpoint = target.href;
			console.log('First level folder endpoint:', folderEndpoint);
			await getSecondLevelFolders(folderEndpoint);
		  }
		});
	} catch (error) {
		console.error(error);
	}
	share.disabled = false;
}

async function getSecondLevelFolders(endpoint) {
	share.disabled = true;

	try {
		const response = await fetch(endpoint);
		const secondLevelFolderList = await response.json();
		console.log('Second level folder list:', secondLevelFolderList);
		const secondLevelFolderListDiv = document.createElement('ul');

		secondLevelFolderList.forEach(folder => {
		  const folderNameLI = document.createElement('li');
		  const folderNameA = document.createElement('a');

		  folderNameA.textContent = folder.folderName;
		  folderNameA.href = "#";
		  folderNameA.dataset.url = folder.folderUrl; // Add this line

		  folderNameLI.appendChild(folderNameA);
		  secondLevelFolderListDiv.appendChild(folderNameLI);
		});

		const fileListDiv = document.getElementById('file-list');
		fileListDiv.innerHTML = ''; // Clear any existing content
		fileListDiv.appendChild(secondLevelFolderListDiv);

		// Add an event listener to the second level folder list container to handle clicks on folder links
		fileListDiv.addEventListener('click', async (event) => {
		  event.preventDefault(); // prevent the default behavior of the link
		  const target = event.target;
		  if (target.tagName === 'A') { // check if the clicked element is a link
			console.log('Clicked second level folder link:', target.href);
			// Call the getFunctionList() function when a second level folder link is clicked
			const folderEndpoint = target.dataset.url; // Use dataset.url instead of


			console.log('Second level folder endpoint:', folderEndpoint);
			await getFunctionList(folderEndpoint);
		  }
		});

	} catch (error) {
		console.error(error);
	}
	share.disabled = false;
}

async function getFunctionList(endpoint) {
  share.disabled = true;

  try {
    const response = await fetch(endpoint);
	console.log(response);
    const functionData = await response.json();
    console.log('Function data:', functionData);
	console.log('Function Syntax:', functionData.syntax);
    // Check if the functionData object contains a functions property that is an array
    if (!functionData.functions || !Array.isArray(functionData.functions)) {
      console.error('Invalid function data:', functionData);
      return;
    }

    // Display the function parameters
    const functionParamsDiv = document.getElementById('function-params');
    if (!functionParamsDiv) {
      console.error('Function params div not found');
      return;
    }
    functionParamsDiv.innerHTML = '';
// select starts
    const functionParamsSelect = document.createElement('select');
    functionParamsSelect.id = 'function-params-select';

    const functionOptions = [];
    functionData.functions.forEach(functionName => {
      const functionOption = {
        name: functionName,
        // add more properties as needed
      };
      functionOptions.push(functionOption);
    });

    functionOptions.forEach(functionOption => {
      const optionElement = document.createElement('option');
      optionElement.value = functionOption.name;
      optionElement.text = functionOption.name;
      functionParamsSelect.appendChild(optionElement);
    });

    functionParamsDiv.appendChild(functionParamsSelect);
// select ends

    // Add an event listener to the function params select to handle form submission
    functionParamsSelect.addEventListener('change', (event) => {
      event.preventDefault(); // prevent the default behavior of the form submission
      const selectedFunctionName = event.target.value;
      console.log('Selected function:', selectedFunctionName);

      // Clear any existing form elements from the function params div
      functionParamsDiv.innerHTML = '';

      // Add the text input field for the function parameters
      const paramsInput = document.createElement('input');
      paramsInput.setAttribute('type', 'text');
      paramsInput.setAttribute('placeholder', 'Enter parameters and values');
      functionParamsDiv.appendChild(paramsInput);

      // Add the button for submitting the function and parameters
      const submitButton = document.createElement('button');
      submitButton.innerText = 'Submit';
      submitButton.addEventListener('click', () => {
        // Construct the URL for the API endpoint
        const url = `https://rpss:8443/share/public/SCORCMD/${selectedFunctionName}`;

        // Get the parameters from the input field
       const paramsString = paramsInput.value.trim();
		const params = {};
		if (paramsString) {
		  const paramPairs = paramsString.split(',');
		  for (const pair of paramPairs) {
			const [param, value] = pair.split(':');
			params[param.trim()] = [value.trim()];
		  }
		}

        // Send a POST request to the API endpoint with the selected function and parameters
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            params: params,
            arguments: []
          })
        })
          .then(response => response.text())
          .then(output => {
			  console.log(output);
			  outputDiv.innerHTML = output;
			})
          .catch(error => console.error(error));
      });
      functionParamsDiv.appendChild(submitButton);
    });
  } catch (error) {
    console.error(error);
  }

  share.disabled = false;
}

const share = document.getElementById('share');
share.addEventListener('click', getContent('https://rpss:8443/share'));


  
