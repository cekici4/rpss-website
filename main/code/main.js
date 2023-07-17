// Cache DOM elements for performance
var dom = dom || {
    outputDiv: document.getElementById('output'),
    functionList: document.getElementById('function-list'),
    outputList: document.getElementById('output'),
    headerText: document.getElementById("function-header"),
    copyDiv: document.getElementById('copy-button'),
    breadcrumbDiv: document.getElementById('breadcrumb'),
    fileListDiv: document.getElementById('fileList'),
    share: document.getElementById('share'),
    selectedFunction: document.getElementById('selectedFunctionName'),
    modal: document.getElementById('myModal'),
    functionSyntax: document.getElementById('functionSyntax'),
    functionParameters: document.getElementById('functionParameters'),
    runButton: document.getElementById('runButton'),
    loadingIndicator: document.getElementById('loadingIndicator'),
};


[dom.headerText, dom.functionList, dom.outputList, dom.copyDiv].forEach(el => {
  if (el) {
    el.style.display = "none";
  } else {
    console.warn('Element is null');
  }
});

var navigationHistory = navigationHistory || [];
var breadcrumbTrail = breadcrumbTrail || [];

// Function to create a bootstrap modal
function createParameterModal() {
  const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  myModal.toggle();
  console.log('run');
}

// Function to render the breadcrumb trail on the page
function renderBreadcrumbTrail() {
  dom.breadcrumbDiv.innerHTML = breadcrumbTrail.join(' > ');
}

// Function to handle folder click
function handleFolderClick(event) {
  event.preventDefault(); // prevent the default behavior of the link
  const target = event.target;
  if (target.tagName === 'A') { // check if the clicked element is a link
    const folderName = target.textContent;
    if (!breadcrumbTrail.includes(folderName)) {
      breadcrumbTrail.push(folderName); // Update breadcrumb
      renderBreadcrumbTrail(); // Render the updated breadcrumb trail
    }

    // Modify this line to correctly build the folderEndpoint URL
    const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;
    
    console.log('Folder endpoint:', folderEndpoint);
    
    // Determine which function to call based on the level of the folder
    if (breadcrumbTrail.length === 1) {
      getFirstLevelFolders(folderEndpoint);
    } else {
      getSecondLevelFolders(folderEndpoint);
    }
  }
}

async function getContent(endpoint = 'https://rpss:8443/share', type = 0, itemName="root") {
    navigationHistory.push(endpoint); // New: Push endpoint to navigation history

    try {
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

                dom.fileListDiv.innerHTML = ''; // Clear any existing content
                dom.fileListDiv.appendChild(ListDiv);

                console.log('file event created');
                dom.fileListDiv.addEventListener('click', async (event) => {
                    event.preventDefault(); 
                    const target = event.target;
                    if (target.dataset.type === 'file') { 
                        console.log('ran');
                        dom.outputDiv.innerHTML = '';
                        const funcPara = document.createElement('div');//
                        funcPara.id = "function-params";
                        dom.fileListDiv.appendChild(funcPara);

                        dom.headerText.style.display = "block";
                        await getFunctionList("https://rpss:8443"+target.dataset.url+ "/" +target.innerHTML);
                    }
                });
                dom.fileListDiv.addEventListener('click', async (event) => {
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
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}


async function getFirstLevelFolders(endpoint = 'https://rpss:8443/share', itemName="firstLevel") {
    navigationHistory.push(endpoint); // New: Push endpoint to navigation history
    
    dom.share.disabled = true;
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

        dom.fileListDiv.innerHTML = ''; // Clear any existing content
        dom.fileListDiv.appendChild(folderListDiv);

        // Add an event listener to the folder list container to handle clicks on folder links
        dom.fileListDiv.addEventListener('click', async (event) => {
			event.preventDefault(); // prevent the default behavior of the link
			const target = event.target;
			if (target.tagName === 'A') { // check if the clicked element is a link
        console.log('Clicked second level folder link:', target.href);

        // Add this block of code
        const folderName = target.textContent;
        if (!breadcrumbTrail.includes(folderName)) {
            breadcrumbTrail.push(folderName); // Update breadcrumb
            renderBreadcrumbTrail(); // Render the updated breadcrumb trail
        }

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
    dom.share.disabled = false;
}


async function getSecondLevelFolders(endpoint, itemName="secondLevel") {
    navigationHistory.push(endpoint); // New: Push endpoint to navigation history
   
    dom.share.disabled = true;

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

        dom.fileListDiv.innerHTML = ''; // Clear any existing content
        dom.fileListDiv.appendChild(secondLevelFolderListDiv);

        // Add an event listener to the second level folder list container to handle clicks on folder links
        dom.fileListDiv.addEventListener('click', async (event) => {
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
    dom.share.disabled = false;
}
async function getFunctionList(endpoint, itemName = "functions") {
    dom.share.disabled = true;

    const optionalParametersNames = [
        'Verbose',
        'Debug',
        'ErrorAction',
        'WarningAction',
        'InformationAction',
        'ErrorVariable',
        'WarningVariable',
        'InformationVariable',
        'OutVariable',
        'OutBuffer',
        'PipelineVariable'
    ];

    try {
        const response = await fetch(endpoint);
        console.log('response-->');
        console.log(response);

        const functionData = await response.json();
        console.log('functionData');
        console.log(functionData);
        if (!functionData.functions || !Array.isArray(functionData.functions)) {
            console.error('Invalid function data:', functionData);
            return;
        }

        dom.functionList.style.display = "block";
        dom.functionList.innerHTML = '';

        const ulElement = document.createElement('ul');

        functionData.functions.forEach(functionName => {
            const liElement = document.createElement('li');
            liElement.textContent = functionName;

            liElement.addEventListener('click', async () => {

                dom.modal.style.display = "block";


                dom.selectedFunction.textContent = `Selected function: ${functionName}`;


                const syntaxResponse = await fetch(`${endpoint}/${functionName}`);
                console.log("syntaxResponse -->")
                console.log(syntaxResponse);
                const syntaxData = await syntaxResponse.json();
                console.log("syntaxData -->")
                console.log(syntaxData);
                let functionInfo = syntaxData.functions[0];

                const synopsis = functionInfo.synopsis;
                console.log("synopsis:", synopsis);
                dom.functionSyntax.textContent = `Synopsis: ${synopsis}`;

                if (syntaxData && syntaxData.functions && syntaxData.functions.length > 0 && syntaxData.functions[0].parameters) {
                    console.log("true");

                    console.log("functioninfo:" + functionInfo);

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

                    const functionParameters = functionInfo.parameters;
                    console.log(functionParameters);
                    functionParameters.forEach(paramObj => {
                        const paramName = paramObj.Name;
                        const paramType = paramObj.ParameterType;

                        const paramDiv = document.createElement('div');
                        paramDiv.setAttribute('data-param-name', paramName);

                        const paramLabel = document.createElement('label');
                        const paramInput = document.createElement('input');

                        paramLabel.textContent = `${paramName}:`;
                        paramInput.setAttribute('name', paramName);
                        paramInput.setAttribute('placeholder', paramType);

                        paramDiv.appendChild(paramLabel);
                        paramDiv.appendChild(paramInput);

                        if (!optionalParametersNames.includes(paramName)) {
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
                            dom.outputList.style.display = "block";
                            dom.copyDiv.style.display = "block";
                            dom.outputDiv.innerText = responseData;

                            // Close the modal
                            dom.modal.style.display = "none";

                        } catch (error) {
                            console.error('Error sending request to the server:', error);
                        }
                    };

                    // Implementation of the Close button
                    const span = document.getElementsByClassName("close")[0];
                    span.onclick = () => {
                        dom.modal.style.display = "none";
                        dom.outputList.style.display = "none";
                        dom.copyDiv.style.display = "none";
                    };
                    dom.outputDiv.style.display = "none";
                    dom.copyDiv.style.display = "none";
                }
            });

            ulElement.appendChild(liElement);
        });

        dom.functionList.appendChild(ulElement);

    } catch (error) {
        console.error(error);
    }
    dom.share.disabled = false;
}
