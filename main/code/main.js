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
    const share = document.getElementById('share');
    share.disabled = true;

    try {
        const response = await fetch(endpoint);
        const functionData = await response.json();

        if (!functionData.functions || !Array.isArray(functionData.functions)) {
            console.error('Invalid function data:', functionData);
            return;
        }

        const functionListDiv = document.getElementById('function-list');
        functionListDiv.innerHTML = '';

        const ulElement = document.createElement('ul');

        functionData.functions.forEach(functionName => {
            const liElement = document.createElement('li');
            liElement.textContent = functionName;

            liElement.addEventListener('click', async () => {
                const modal = document.getElementById('myModal');
                modal.style.display = "block";

                const selectedFunctionNameDisplay = document.getElementById('selectedFunctionName');
                selectedFunctionNameDisplay.textContent = `Selected function: ${functionName}`;

                const functionSyntaxDisplay = document.getElementById('functionSyntax');
                const syntaxResponse = await fetch(`${endpoint}/${functionName}`);
                const syntaxData = await syntaxResponse.json();

                let parsedSyntax = null;
                try {
                    parsedSyntax = JSON.parse(syntaxData.syntax);
                } catch {
                    parsedSyntax = syntaxData.syntax;
                }
                functionSyntaxDisplay.textContent = `Syntax: ${parsedSyntax}`;

                if (syntaxData && syntaxData.length > 0 && syntaxData[0].parameters) {
                    const functionParametersDisplay = document.getElementById('functionParameters');
                    functionParametersDisplay.innerHTML = '';

                    const requiredParametersDiv = document.createElement('div');
                    const optionalParametersDiv = document.createElement('div');
                    const activeOptionalParametersDiv = document.createElement('div');
                    const optionalParametersList = document.createElement('ul');

                    // Initially hide optional parameters list
                    optionalParametersList.style.display = "none";

                    activeOptionalParametersDiv.innerHTML = '<h4>Active Optional Parameters:</h4>';
                    requiredParametersDiv.innerHTML = '<h4>Required Parameters:</h4>';
                    optionalParametersDiv.innerHTML = '<h4>Optional Parameters:</h4>';

                    // Create a button to toggle display of optional parameters
                    const toggleOptionalButton = document.createElement('button');
                    toggleOptionalButton.textContent = "Toggle Optional Parameters";

                    // Toggle the display when the button is clicked
                    toggleOptionalButton.addEventListener('click', () => {
                        if (optionalParametersList.style.display === "none") {
                            optionalParametersList.style.display = "block";
                        } else {
                            optionalParametersList.style.display = "none";
                        }
                    });

                    syntaxData[0].parameters.forEach(paramString => {
                        const [paramName, paramType] = paramString.split(' ');

                        const paramDiv = document.createElement('div');
                        paramDiv.setAttribute('data-param-name', paramName);

                        const paramLabel = document.createElement('label');
                        const paramInput = document.createElement('input');

                        paramLabel.textContent = `${paramName}:`;
                        paramInput.setAttribute('name', paramName);
                        paramInput.setAttribute('placeholder', paramType);

                        paramDiv.appendChild(paramLabel);
                        paramDiv.appendChild(paramInput);

                        if (paramString.includes("(String)")) {
                            requiredParametersDiv.appendChild(paramDiv);
                        } else {
                            const addButton = document.createElement('button');
                            addButton.textContent = '+';
                            addButton.addEventListener('click', () => {
                                activeOptionalParametersDiv.appendChild(paramDiv);
                                paramDiv.removeChild(addButton);

                                const removeButton = document.createElement('button');
                                removeButton.textContent = '-';
                                removeButton.addEventListener('click', () => {
                                    optionalParametersList.appendChild(paramDiv);
                                    paramDiv.removeChild(removeButton);
                                    paramDiv.appendChild(addButton);
                                });
                                paramDiv.appendChild(removeButton);
                            });
                            paramDiv.appendChild(addButton);
                            optionalParametersList.appendChild(paramDiv);
                        }
                    });

                    optionalParametersDiv.appendChild(toggleOptionalButton);
                    optionalParametersDiv.appendChild(optionalParametersList);
                    functionParametersDisplay.appendChild(requiredParametersDiv);
                    functionParametersDisplay.appendChild(activeOptionalParametersDiv);
                    functionParametersDisplay.appendChild(optionalParametersDiv);

                    // Implementation of the Run button
                    const runButton = document.getElementById('runButton');
                    runButton.onclick = async () => {
                        const loadingIndicator = document.getElementById('loadingIndicator');
                        loadingIndicator.style.display = 'block';

                        const requiredParameters = Array.from(requiredParametersDiv.getElementsByTagName('input'));
                        const activeOptionalParameters = Array.from(activeOptionalParametersDiv.getElementsByTagName('input'));

                        const params = {};

                        // Add required parameters to the parameters object
                        requiredParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // Add active optional parameters to the parameters object
                        activeOptionalParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // POST request code here...
                        const apiUrl = `${endpoint}/${functionName}`; // Modify if needed
                        const requestBody = {
                            params: params,
                            functionArguments: [] // Add your function arguments here
                        };

                        try {
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(requestBody)
                            });
                            loadingIndicator.style.display = 'none';

                            const responseData = await response.text();
                            console.log('Server Response:', responseData);

                            // Display the server response inside the div with id 'output'
                            const outputDiv = document.getElementById('output');
                            outputDiv.innerText = responseData;
                            // Close the modal
                            modal.style.display = "none";

                        } catch (error) {
                            console.error('Error sending request to the server:', error);
                        }
                    };

                    // Implementation of the Close button
                    const span = document.getElementsByClassName("close")[0];
                    span.onclick = () => {
                        modal.style.display = "none";
                    };
                }
            });

            ulElement.appendChild(liElement);
        });

        functionListDiv.appendChild(ulElement);

    } catch (error) {
        console.error(error);
    }
}



const share = document.getElementById('share');
share.addEventListener('click', getContent('https://rpss:8443/share'));



  