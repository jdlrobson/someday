export default function ( desc ) {
	return desc.replace( /^[—-]/g, '' ).trim();
}
