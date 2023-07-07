const outputDiv = document.getElementById('output');
const navigationHistory = []; 
const breadcrumbTrail = [];

function createParameterModal() {
	const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
	myModal.toggle();
	console.log('run');
}
// New: Function to render the breadcrumb trail on the page
function renderBreadcrumbTrail() {
    const breadcrumbDiv = document.getElementById('breadcrumb');
    breadcrumbDiv.innerHTML = breadcrumbTrail.join(' > ');
}
const functionList= document.getElementById('function-list');
const outputList= document.getElementById('output');
var headerText = document.getElementById("function-header");
const copyDiv = document.getElementById('copy-button');
headerText.style.display = "none";
functionList.style.display = "none";
outputList.style.display = "none";
copyDiv.style.display = "none";

async function getContent(endpoint = 'https://rpss:8443/share', type = 0, itemName="root") {
	  navigationHistory.push(endpoint); // New: Push endpoint to navigation history
    
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
						
			headerText.style.display = "block";
						await getFunctionList("https://rpss:8443"+target.dataset.url+ "/" +target.innerHTML);
					}
				});
				 fileListDiv.addEventListener('click', async (event) => {
				event.preventDefault();
				const target = event.target;
				if (target.dataset.type === 'folder') {
					const folderName = target.textContent;
					if (!breadcrumbTrail.includes(folderName)) {
						breadcrumbTrail.push(folderName);
                renderBreadcrumbTrail(); // Render the updated breadcrumb trail
            }
            await getContent("https://rpss:8443" + target.dataset.url);
        }
    });

			break;
	}
}
async function getFirstLevelFolders(endpoint = 'https://rpss:8443/share', itemName="firstLevel") {
    navigationHistory.push(endpoint); // New: Push endpoint to navigation history
    
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
                
                const folderName = target.textContent;
                if (!breadcrumbTrail.includes(folderName)) {
                    breadcrumbTrail.push(folderName); // Update breadcrumb
                    renderBreadcrumbTrail(); // Render the updated breadcrumb trail
                }
                
                // Call the getSecondLevelFolders() function when a first level folder link is clicked
               const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;

                console.log('First level folder endpoint:', folderEndpoint);
				updateBreadcrumbs(navigationHistory);
                await getSecondLevelFolders(folderEndpoint);
            }
        });
    } catch (error) {
        console.error(error);
    }
    share.disabled = false;
}


async function getSecondLevelFolders(endpoint) {
    navigationHistory.push(endpoint); // New: Push endpoint to navigation history
   
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

                // Modify this line to correctly build the folderEndpoint URL
                const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;
                
                console.log('Second level folder endpoint:', folderEndpoint);
				
                await getFunctionList(folderEndpoint);
            }
			updateBreadcrumbs(navigationHistory);
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
		functionList.style.display = "block";
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
							outputList.style.display = "block";
							const copyDiv = document.getElementById('copy-button');
							copyDiv.style.display = "block";
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
						outputList.style.display = "none";
						copyDiv.style.display = "none";
						
                    };
					const outputDiv = document.getElementById('output');
					outputDiv.style.display = "none";
					
					copyDiv.style.display = "none";
					
                }
            });

            ulElement.appendChild(liElement);
        });

        functionListDiv.appendChild(ulElement);

    } catch (error) {
        console.error(error);
    }
	
}

// New: Function to handle the back button click
function updateBreadcrumbs(navigationHistory) {
    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    breadcrumbsDiv.innerHTML = ''; // Clear existing breadcrumbs

    navigationHistory.forEach((url, index) => {
        const crumb = document.createElement('a');
        crumb.href = "#";
        crumb.textContent = `Folder ${index + 1}`;
        crumb.dataset.url = url;
        
        // Add click event to breadcrumb
        crumb.addEventListener('click', async (event) => {
            event.preventDefault();
            // Navigate to the folder by calling the appropriate function with the url
            // For example:
            if (index === 0) { // if it's the first breadcrumb
                await getFirstLevelFolders(url);
            } else {
                await getSecondLevelFolders(url);
            }
        });

        breadcrumbsDiv.appendChild(crumb);

        // Optionally add a separator (except after the last crumb)
        if (index < navigationHistory.length - 1) {
            const separator = document.createTextNode(' > ');
            breadcrumbsDiv.appendChild(separator);
        }
    });
}




const share = document.getElementById('share');
share.addEventListener('click', getContent('https://rpss:8443/share'));



  