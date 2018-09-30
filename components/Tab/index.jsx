import React from 'react';
import { HorizontalList, TruncatedText } from 'wikipedia-react-components';
import './styles.less';

export default ( { children } ) => {
	return <HorizontalList className="tabs">{
		children.map( ( child, i ) => <TruncatedText key={`trunc-${i}`}>{child}</TruncatedText> )
	}</HorizontalList>;
};
