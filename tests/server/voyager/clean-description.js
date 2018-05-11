var assert = require( 'assert' );

import cleanDesc from './../../../server/endpoints/voyager/clean-description';

describe('clean-description', function() {
  it('clean-description', function() {
    const examples = [
      [
        '— charming, picture postcard villages set in some of the finest landscapes anywhere in Britain',
        'charming, picture postcard villages set in some of the finest landscapes anywhere in Britain',
        'England'
      ]
  	]
    examples.forEach( ( example ) => {
      assert.strictEqual( cleanDesc(example[0]), example[1], example[2] );
    });
  });
});