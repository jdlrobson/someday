import React from 'react';

import { Page, Menu, Column, PageBanner, Note } from './../components';

export default () => {
    return (
        <Page>
            <Column>
                <Menu key="menu" />
                <PageBanner title="this page broke" slogan="WHOOPS"
                    key="banner"
                    api="/api/random/en"
                />
                <Note>
                    <div>🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 
                    🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 
                    🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥</div>
                    <p>We broke something. We're sorry.<br />
                    We know about it and we'll fix it.<br />
                    Please travel to another page in the mean time!
                    </p>
                </Note>
            </Column>
        </Page>
    );
}
