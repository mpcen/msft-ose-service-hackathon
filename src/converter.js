const fs = require('fs');

function main(manifestDir)
{
    let files = fs.readdirSync(manifestDir);
    let manifestName = files.filter(file => file.toLowerCase().includes("govcompdisc_manifest"))[0];

    const sampleDetectionOutput = JSON.parse(fs.readFileSync(manifestDir + '/' + manifestName).toString());

    let componentMap = new Map();
    let locationsMap = new Map();

    function processRegistration(registration)
    {
        let requestComponent = getRequestComponent(registration);
        let key = requestComponent.coordinates.name + '--' + requestComponent.coordinates.version + '--' + requestComponent.coordinates.type; 

        // Add this component to the components we have seen
        if (!componentMap.has(key))
        {
        componentMap.set(key, requestComponent)
        }

        // Initialize locations if needed and add component to the right location
        for (location of registration.DetectedComponentLocations)
        {
            if (!locationsMap.has(location))
            {
                locationsMap.set(location, []);
            }

            locationsMap.get(location).push(componentMap.get(key));
        }
    }

    function processRootsForRegistration(registration)
    {
        let registrationRoots = registration.DependencyRoots;

        if (registrationRoots)
        {
            let typeNameAndVersion = getComponentTypeNameAndVersion(registration.Component);
            let registrationKey = typeNameAndVersion.name + '--' + typeNameAndVersion.version + '--' + typeNameAndVersion.type; 
            let registrationCoordinates = componentMap.get(registrationKey).coordinates;

            for (root of registrationRoots)
            {
                // Find the root in the map, then add this component's coordinates to their dependencies
                let rootTypeNameAndVersion = getComponentTypeNameAndVersion(root);
                let rootKey = rootTypeNameAndVersion.name + '--' + rootTypeNameAndVersion.version + '--' + rootTypeNameAndVersion.type; 
                
                // If something is a root of itself, do not add it to dependencies, but mark it as directDependency = true
                if (rootKey == registrationKey)
                {
                    componentMap.get(rootKey).directDependency = true;
                }
                else
                {
                    componentMap.get(rootKey).dependencies.push({coordinates: registrationCoordinates});
                }
            }
        }
    }

    function getRequestComponent(registration)
    {
        let typeNameAndVersion = getComponentTypeNameAndVersion(registration.Component);
        
        let getRequestComponent = {
            coordinates: {
                type: typeNameAndVersion.type,
                name: typeNameAndVersion.name,
                version: typeNameAndVersion.version
            },
            usage: {
                devDependency: registration.DevelopmentDependency
            },
            dependencies: []
        };

        return getRequestComponent;
    }

    function getComponentTypeNameAndVersion(component)
    {
        let typeKey = getTypeKey(component.Type);
        let typedComponent = component[typeKey];
        
        let name = typedComponent.Name || 
                (typedComponent.GroupId ? typedComponent.GroupId + ":" + typedComponent.ArtifactId : undefined) || 
                typedComponent.RepositoryUrl;

        let version = typedComponent.DownloadUrl ||
                typedComponent.Version || 
                typedComponent.Digest || 
                typedComponent.GitHash ||
                typedComponent.CommitHash;
        
        return {
            type: typeKey.toLocaleLowerCase(),
            name: name,
            version: version
        };
    }

    function getTypeKey(typeValue)
    {
        switch (typeValue)
        {
            case 1: return 'NuGet';
            case 2: return 'Npm';
            case 3: return 'Maven';
            case 4: return 'Git';
            case 5: return 'Other';
            case 6: return 'RubyGems';
            case 7: return 'Cargo';
            case 8: return 'Pip';
            case 9: return 'File';
            case 10: return 'Go';
            case 11: return 'DockerImage';
            case 12: return 'Pod';
        }
    }

    // Add all registration components to their respective locations and have a map for easy access
    for (registration of sampleDetectionOutput)
    {
        processRegistration(registration);
    }

    // Iterate again to populate roots
    for (registration of sampleDetectionOutput)
    {
        processRootsForRegistration(registration);
    }

    let cgRequest = 
    {
        locations: [],
        metadata: {
            commit: "jgljlgjrgjortgrtop",
            branch: "master",
            key: "workflow",
            value: "123",
            dateModified: "2020-02-19T01:27:59.532Z"
        }
    };

    locationsMap.forEach(function(value, key) 
    {
        cgRequest.locations.push(
            {
                path: key,
                components: value
            }
        )
    });

    fs.writeFile('./outputRequest.json', JSON.stringify(cgRequest), function(){console.log('done')});
}

module.exports = main