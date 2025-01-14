import React, { FC } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import OverlayTitle from '../OverlayTitle/';
import OverlayEvent from '../OverlayEvent/';
import Icon from '../../Icons';
import OverlayBeta from '../OverlayBeta/';
import OverlayParagraph from '../OverlayParagraph';
import OverlayDescription from '../OverlayDescription/';
import ButtonRound from '../../../components/ButtonRound/';
import Login from '../../../components/Login/';

import content from '../../../assets/content';
import { useActions } from '../../../state/unistore-hooks';
import OverlayClose from '../OverlayClose';

const Wrapper = styled.div`
  display: flex;
  img {
    transform: translate(-35px, -20px);
    @media screen and (max-width: ${p => p.theme.screens.tablet}) {
      transform: translate(-35px, -40px);
    }
  }
`;

const StyledTop = styled.div`
  height: 500px;
  height: auto;
  padding: 40px 0;
`;

const StyledWrapper = styled.div`
  display: flex;
  margin: 20px 40px 20px 40px;
  cursor: pointer;
  div {
    margin-right: 10px;
    @media screen and (max-width: ${p => p.theme.screens.tablet}) {
      margin-bottom: 10px;
    }
  }

  @media screen and (max-width: ${p => p.theme.screens.tablet}) {
    flex-direction: column;
  }
`;

const OverlayTop: FC = () => {
  const { closeOverlay } = useActions();
  const { intro, eventNote, whatsNew } = content;

  const { title, subline, description, disclaimer, callToAction } = intro;

  return (
    <StyledTop>
      <Wrapper>
        <OverlayTitle size='xxl' title={title} />
        <img style={{ height: 160 }} src='images/leipzig-giesst-logo.png' />
        { (!isMobile && callToAction) && <OverlayParagraph key={`Overlay-description-CtA`}><span style={{ color: 'red', width: '80%', float: 'left'}}>{callToAction}</span><span style={{ width: '20%', float: 'left'}}> </span></OverlayParagraph>}
      </Wrapper>
      <OverlayTitle size='xxl' title={subline} />
      {isMobile && <OverlayTitle size='medium' title={disclaimer} />}
      {/* the beow is here for local testing */}
      {/* {true && <OverlayTitle size='medium' content={disclaimer} />} */}
      { (isMobile && callToAction) && <OverlayParagraph key={`Overlay-description-CtA`}><span style={{ marginLeft: '40px', textAlign: 'center', width: '80%', float: 'left', color: 'red'}}>{callToAction}</span><span style={{ content: '', display: 'block', clear: 'both'}}><br /></span></OverlayParagraph>}
      <OverlayDescription content={description} />
      <OverlayClose onClick={closeOverlay} />
      <StyledWrapper>
        <ButtonRound
          width='fit-content'
          onClick={() => {
            closeOverlay();
          }}
          type='primary'
        >
          Los geht&apos;s
        </ButtonRound>
        <Login width='fit-content' noLogout={true} />
      </StyledWrapper>
      {(eventNote !== undefined || whatsNew !== undefined) && (
        <OverlayTitle size='xl' title={'News & Updates'} />
      )}

      {eventNote && <OverlayEvent size='Ll' title={eventNote.title} />}
      {whatsNew && <OverlayDescription content={whatsNew.description} />}
    </StyledTop>
  );
};

export default OverlayTop;
