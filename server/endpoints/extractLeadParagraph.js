import { isNodeEmpty } from './voyager/domino-utils';
const TEXT_NODE = 3;

/**
 * Extracts the first non-empty paragraph from an article and any
 * nodes that follow it that are not themselves paragraphs.
 * @param {!Document} doc representing article
 * @param {boolean} removeNodes when set the lead introduction will
 *  be removed from the input DOM tree.
 * @return {string} representing article introduction
 */
function extractLeadIntroduction( doc, removeNodes ) {
	let p = '';
	const remove = [];
	const blacklist = [ 'P', 'TABLE', 'CENTER', 'FIGURE', 'DIV' ];
	const nodes = doc.querySelectorAll( 'body > p' );

	Array.prototype.forEach.call( nodes, ( node ) => {
		let nextSibling;
		if ( !p && !isNodeEmpty( node ) && ( !( node.hasAttribute( 'about' ) ) || node.querySelector( 'b' ) ) ) {
			p = node.outerHTML;
			remove.push( node );
			nextSibling = node.nextSibling;
			// check the next element is a text node or not in list of blacklisted elements
			while ( nextSibling && ( nextSibling.nodeType === TEXT_NODE ||
                blacklist.indexOf( nextSibling.tagName ) === -1
			) ) {
				// Deal with text nodes
				if ( nextSibling.nodeType === TEXT_NODE ) {
					if ( !isNodeEmpty( nextSibling ) ) {
						p += nextSibling.textContent;
					}
				} else {
					p += nextSibling.outerHTML;
				}
				remove.push( nextSibling );
				nextSibling = nextSibling.nextSibling;
			}
		}
	} );
	// cleanup all the nodes.
	if ( removeNodes ) {
		remove.forEach( ( node ) => {
			node.parentNode.removeChild( node );
		} );
	}
	return p;
}

module.exports = extractLeadIntroduction;
