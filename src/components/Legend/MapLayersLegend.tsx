import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { interpolateColor } from '../../utils/colorUtil';
import { useActions, useStoreState } from '../../state/unistore-hooks';
import { workingColor } from '../TreesMap/mapColorUtil';
import { createCSSGradient } from './createCSSGradient';
import { PumpsColorLegend } from './PumpsColorLegend';
import { RainColorLegend } from './RainColorLegend';
import { TreesColorLegend } from './TreesColorLegend';
import {
  FlexColumn,
  FlexColumnLast,
  FlexRow,
  FlexRowFit,
  FlexSpace,
} from './LegendFlexBoxes';
import { LegendDot, LegendRect, StrokedLegendDot } from './LegendRectsDots';
import { ItemLabel, legendLabels } from './LegendLabels';
import SmallParagraph from '../SmallParagraph';
import { isMobile } from 'react-device-detect';
import { VisibleMapLayerType } from '../../common/types';

export interface IsActiveProps {
  isActive?: boolean;
}

const StyledItemLabel = styled(ItemLabel)`
  width: auto;
  padding: 0;
`;

const LegendDiv = styled.div<IsActiveProps>`
  position: absolute;
  bottom: 36px;
  right: 12px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  margin: 0 auto;
  font-size: 12px;
  box-shadow: ${p => p.theme.boxShadow};
  height: min-content;
  ${props => (props.isActive ? 'min-height: 230px;' : '')}
  padding: 12px;
  width: ${p => (p.isActive ? '210px' : '90px')};
  background: white;
`;

const StyledCardDescription = styled(SmallParagraph)`
  font-weight: bold;
  font-size: 0.8rem;
  opacity: 1;
`;

const LegendToggle = styled.span`
  cursor: pointer;
  height: fit-content;
  &:hover {
    opacity: 0.66;
  }
`;
const rainColors = legendLabels.map(item => interpolateColor(item.value));
const rainGradient = createCSSGradient(rainColors);

const MapLayerLegend: FC = () => {
  const { setVisibleMapLayer } = useActions();

  const visibleMapLayer = useStoreState('visibleMapLayer');
  const [waterSourcesVisible, setWaterSourcesVisible] = useState(visibleMapLayer.indexOf('water_sources') >= 0);
  const [rainVisible, setRainVisible] = useState(visibleMapLayer.indexOf('rain') >= 0);
  const [treesVisible, setTreesVisible] = useState(visibleMapLayer.indexOf('trees') >= 0);
  const [pumpsVisible, setPumpsVisible] = useState(visibleMapLayer.indexOf('pumps') >= 0);

  const [legendExpanded, setLegendExpanded] = useState(isMobile ? false : true);

  const removeFromList = (current: VisibleMapLayerType[], elem: VisibleMapLayerType, 
      setter: Dispatch<SetStateAction<boolean>>) => {
    const index = current.indexOf(elem);
    if (index >= 0) {
      current.splice(index, 1)
      setter(false)
    }
  }

  if (legendExpanded === false) {
    return (
      <LegendDiv>
        <FlexSpace>
          <FlexColumn>
            <StyledCardDescription onClick={() => setLegendExpanded(true)}>
              Legende
            </StyledCardDescription>
          </FlexColumn>
          <LegendToggle onClick={() => setLegendExpanded(true)}>+</LegendToggle>
        </FlexSpace>
      </LegendDiv>
    );
  }

  return (
    <LegendDiv isActive>
      <FlexSpace isActive>
        <FlexColumnLast>
          <StyledCardDescription onClick={() => setLegendExpanded(false)}>
          {(() => {
              var labels: string[] = [];
              if (treesVisible || rainVisible) {
                labels.push('Niederschlag + Gießmenge');
              } else if (waterSourcesVisible) {
                labels.push('Wasserquellen');
              }
              return labels.length > 1 ? labels[0] + " / " + labels[1] : labels[0];
            })()}                
          </StyledCardDescription>
          {treesVisible && (
            <SmallParagraph>der letzten 30 Tage (Liter)</SmallParagraph>
          )}
        </FlexColumnLast>
        <LegendToggle onClick={() => setLegendExpanded(false)}>—</LegendToggle>
      </FlexSpace>
      {!pumpsVisible && (
        <FlexRow>
          {treesVisible && <TreesColorLegend />}
          {rainVisible && <RainColorLegend />}
        </FlexRow>
      )}
      {pumpsVisible && <PumpsColorLegend />}

      <FlexColumnLast isLast={true}>
        <StyledCardDescription>Datenpunkte</StyledCardDescription>
        <SmallParagraph>durch Klick ein- & ausblenden.</SmallParagraph>
        <FlexRowFit
          isActive={treesVisible}
          onClick={() => {
            setVisibleMapLayer((() => {
              const current = visibleMapLayer
              if (current.indexOf('trees') < 0) {
                removeFromList(current, 'rain', setRainVisible)
                removeFromList(current, 'pumps', setPumpsVisible)
                current.push('trees');
                setTreesVisible(true)
              } else {
                removeFromList(current, 'trees', setRainVisible)
                setTreesVisible(false)
              }
              return current
          })())}}
        >
          <LegendDot
            className={'legend-dot'}
            color={'#2c303b'}
            gradient={treesVisible ? rainGradient : undefined}
          />

          <StyledItemLabel>Straßen- & Anlagenbäume <br />(4 - 15 Jahre alt)</StyledItemLabel>
        </FlexRowFit>
        { treesVisible && <span style={{ paddingLeft: "10px", paddingBottom: "5px", paddingTop: "5px" }}>
          <LegendDot
            className={'legend-dot'}
            style={{ float: "left" }}
            color={'#bcd0bf'}
          />
          <StyledItemLabel>Straßen- & Anlagenbäume <br />(&lt; 4 Jahre alt, von Stadt gegossen)</StyledItemLabel>
        </span> }
        { treesVisible && <span style={{ paddingLeft: "10px", paddingBottom: "5px", paddingTop: "5px" }}>
          <LegendDot
            className={'legend-dot'}
            style={{ float: "left" }}
            color={'#7E8E80'}
          />
          <StyledItemLabel>Straßen- & Anlagenbäume <br />(&gt; 15 Jahre alt, selbstversorgend)</StyledItemLabel>
        </span> }

        { false && <FlexRowFit
          isActive={pumpsVisible}
          onClick={() => {
            setVisibleMapLayer((() => {
              const current = visibleMapLayer
              if (current.indexOf('pumps') < 0) {
                removeFromList(current, 'trees', setTreesVisible)
                removeFromList(current, 'rain', setRainVisible)
                removeFromList(current, 'water_sources', setWaterSourcesVisible)
                current.push('pumps');
                setPumpsVisible(true)
              } else {
                removeFromList(current, 'pumps', setRainVisible)
                setPumpsVisible(false)
              }
              return current
          })())}}
        >
          <StrokedLegendDot
            gradient={
              pumpsVisible ? workingColor.hex : undefined
            }
          />

          <StyledItemLabel>Öffentl. Pumpen</StyledItemLabel>
        </FlexRowFit> }
        <FlexRowFit
          isActive={waterSourcesVisible}
          onClick={() => {
            setVisibleMapLayer((() => {
              const current = visibleMapLayer
              if (current.indexOf('water_sources') < 0) {
                removeFromList(current, 'rain', setRainVisible)
                removeFromList(current, 'pumps', setWaterSourcesVisible)
                current.push('water_sources');
                setWaterSourcesVisible(true)
              } else {
                removeFromList(current, 'water_sources', setRainVisible)
                setWaterSourcesVisible(false)
              }
              return current
          })())}}
        >
          <StrokedLegendDot
            gradient={
              waterSourcesVisible ? "#0000ff" : undefined
            }
          />
          <StyledItemLabel>Wasserquellen</StyledItemLabel>
        </FlexRowFit>
        {waterSourcesVisible === true && (
              <div>kostenlose, öffentlich zugängliche Wasserquellen, damit weite 
                Wasser-Transportwege entfallen und möglichst geringe Wasserkosten 
                entstehen. Möchtest Du auch anderen Wasser zum Gießen bereitstellen, 
                melde Dich gerne bei <a href="mailto:wasserspende@leipziggiesst.de">uns</a>.
              </div>
            )}
        <FlexRowFit
          isActive={rainVisible}
          onClick={() => {
            setVisibleMapLayer((() => {
              const current = visibleMapLayer;
              if (current.indexOf('rain') < 0) {
                removeFromList(current, 'pumps', setPumpsVisible)
                removeFromList(current, 'trees', setTreesVisible)
                removeFromList(current, 'water_sources', setWaterSourcesVisible)
                current.push('rain');
                setRainVisible(true)
              } else {
                removeFromList(current, 'rain', setRainVisible)
                setRainVisible(false)
              }
              return current
          })())}}
        >
          <LegendRect
            gradient={rainVisible ? rainGradient : undefined}
          />

          <StyledItemLabel>Niederschlagsflächen</StyledItemLabel>
        </FlexRowFit>
      </FlexColumnLast>
    </LegendDiv>
  );
};

export default MapLayerLegend;
