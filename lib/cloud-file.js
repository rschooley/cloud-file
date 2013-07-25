
//
// dependencies
//

var knox = require('knox');

//
// module
//

var CloudFile = function (options) {

//
// init
//

    var client = buildClient();

//
// public functions
//

    function save (file, destination, callback) {
        var headers         = buildHeaders(file),
            destinationPath = buildDestinationPath(file, destination),
            sourcePath      = file.path,
            url             = buildUrl(destinationPath);

        client.putFile(sourcePath, destinationPath, headers, function (err, res) {
            var result = {
                name:   destinationPath,
                url:    url 
            }

            callback(err, result);
        });
    }

//
// helpers
//

    function buildClient () {
        return knox.createClient(options);
    }

    function buildDestinationPath (file, destination) {
        var name        = file.path.split('/').pop(), // use the random name generated (path doesn't have an extension)
            extension   = file.name.split('.').pop(), // with the extension for the file
            fullName    = [name, extension].join('.');

        return [destination, fullName].join('/');
    }

    function buildHeaders (file) {
        var headers = {
            'Content-Type': file.type,      // MIME
            'x-amz-acl':    'public-read'   // todo: Amazon specific, check options for platform
        };

        return headers;
    }

    function buildUrl (destinationPath) {
        var url = [
            'https://s3.amazonaws.com',         // todo: Amazon specific, check options for platform
            options.bucket,                     // todo: Amazon specific, check options for platform
            destinationPath
        ].join('/');

        return url;
    }

//
// public object
//

    return {
        save: save
    };
};

//
// exports
//

module.exports = CloudFile;
