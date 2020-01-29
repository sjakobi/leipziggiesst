import React from 'react';
import styled from 'styled-components';

import DeckGlMap from '../map';
import Sidebar from '../Sidebar';
import NavBar from '../Navbar';
import Loading from '../Loading';

import logo from '!file-loader!../../assets/citylab-logo.svg';

const AppWrapperDiv = styled.div`
font-family: ${props => props.theme.fontFamily};
`;

const AppWrapper = p => {
  const { isLoading, data } = p;
  return (
    <AppWrapperDiv>
        {isLoading && (<Loading/>)}
        <div>
            {/* {TSBLink()} */}
            {!isLoading && data && (<DeckGlMap data={data}/>)}
            {!isLoading && data && (<Sidebar/>)}
            <NavBar/>
        </div>
    </AppWrapperDiv>
  )
}

export default AppWrapper;