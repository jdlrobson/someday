import React from 'react';

import { Page, Menu, Column, PageBanner, Note } from './../components';

export default () => {
    return (
        <Page>
            <Column>
                <Menu key="menu" />
                <PageBanner title="Unknown" slogan="destination"
                    key="banner"
                    api="/api/random/en"
                />
                <Note>
                    <p>
                        🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 🛫 <br/>
                        This place/trip/sight is not listed on our site, but we'll investigate what we need to do to fix that.
                    </p>
                </Note>
            </Column>
        </Page>
    );
}