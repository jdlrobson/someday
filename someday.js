const disabledExtension = function () { return null; };

// Allow use of ES2015 transpiler e.g. import/const etc..
require( '@babel/register' );
require.extensions[ '.less' ] = disabledExtension;
require.extensions[ '.css' ] = disabledExtension;
require( './server/index.js' );
