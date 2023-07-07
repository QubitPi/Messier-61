// Copyright 2023 Paion Data. All rights reserved.
import { useState } from "react";
import {
  PaneBody,
  PaneBodySectionHeaderWrapper,
  PaneBodySectionSmallText,
  PaneBodySectionTitle,
  PaneHeader,
  PaneWrapper,
  StyledLegendInlineList,
} from "../../../styles/DefaultPane.styled";
import { OverviewPaneProps, numberToUSLocale } from "../../DefaultOverviewPane";
import { StyleableNodeLabel } from "./StyleableNodeLabel";
import { ShowMoreOrAll } from "../../ShowMoreOrAll";
import { StyleableRelType } from "./StyleableRelType";
import { WarningMessage } from "../../WarningMessage";

type PaneBodySectionHeaderProps = {
  title: string;
  numOfElementsVisible: number;
  totalNumOfElements: number;
};

function PaneBodySectionHeader({ title, numOfElementsVisible, totalNumOfElements }: PaneBodySectionHeaderProps) {
  return (
    <PaneBodySectionHeaderWrapper>
      <PaneBodySectionTitle>{title}</PaneBodySectionTitle>
      {numOfElementsVisible < totalNumOfElements && (
        <PaneBodySectionSmallText>
          {`(showing ${numOfElementsVisible} of ${totalNumOfElements})`}
        </PaneBodySectionSmallText>
      )}
    </PaneBodySectionHeaderWrapper>
  );
}

export const OVERVIEW_STEP_SIZE = 50;

export default function OverviewPane({
  graphStyle,
  hasTruncatedFields,
  nodeCount,
  relationshipCount,
  stats,
  infoMessage,
}: OverviewPaneProps): JSX.Element {
  const [maxLabelsCount, setMaxLabelsCount] = useState(OVERVIEW_STEP_SIZE);
  const [maxRelationshipsCount, setMaxRelationshipsCount] = useState(OVERVIEW_STEP_SIZE);

  const onMoreLabelsClick = (numMore: number) => {
    setMaxLabelsCount(maxLabelsCount + numMore);
  };

  const onMoreRelationshipsClick = (numMore: number) => {
    setMaxRelationshipsCount(maxRelationshipsCount + numMore);
  };

  const { relTypes, labels } = stats;
  const visibleLabelKeys = labels ? Object.keys(labels).slice(0, maxLabelsCount) : [];
  const visibleRelationshipKeys = relTypes ? Object.keys(relTypes).slice(0, maxRelationshipsCount) : [];
  const totalNumOfLabelTypes = labels ? Object.keys(labels).length : 0;
  const totalNumOfRelTypes = relTypes ? Object.keys(relTypes).length : 0;

  return (
    <PaneWrapper>
      <PaneHeader>{"Overview"}</PaneHeader>
      <PaneBody>
        {labels && visibleLabelKeys.length !== 0 && (
          <div>
            <PaneBodySectionHeader
              title={"Node labels"}
              numOfElementsVisible={visibleLabelKeys.length}
              totalNumOfElements={totalNumOfLabelTypes}
            ></PaneBodySectionHeader>
            <StyledLegendInlineList>
              {visibleLabelKeys.map((label: string) => (
                <StyleableNodeLabel
                  key={label}
                  graphStyle={graphStyle}
                  allNodesCount={nodeCount}
                  selectedLabel={{
                    label,
                    propertyKeys: Object.keys(labels[label].properties),
                    count: labels[label].count,
                  }}
                />
              ))}
            </StyledLegendInlineList>
            <ShowMoreOrAll
              total={totalNumOfLabelTypes}
              shown={visibleLabelKeys.length}
              moreStep={OVERVIEW_STEP_SIZE}
              onMore={onMoreLabelsClick}
            />
          </div>
        )}
        {relTypes && visibleRelationshipKeys.length !== 0 && (
          <div>
            <PaneBodySectionHeader
              title={"Relationship types"}
              numOfElementsVisible={visibleRelationshipKeys.length}
              totalNumOfElements={totalNumOfRelTypes}
            />
            <StyledLegendInlineList>
              {visibleRelationshipKeys.map((relType) => (
                <StyleableRelType
                  key={relType}
                  graphStyle={graphStyle}
                  selectedRelType={{
                    relType,
                    propertyKeys: Object.keys(relTypes[relType].properties),
                    count: relTypes[relType].count,
                  }}
                />
              ))}
            </StyledLegendInlineList>
            <ShowMoreOrAll
              total={totalNumOfRelTypes}
              shown={visibleRelationshipKeys.length}
              moreStep={OVERVIEW_STEP_SIZE}
              onMore={onMoreRelationshipsClick}
            />
          </div>
        )}
        <div style={{ paddingBottom: "10px" }}>
          {hasTruncatedFields && (
            <>
              <WarningMessage text={"Record fields have been truncated."} />
              <br />
            </>
          )}
          {infoMessage && (
            <>
              <WarningMessage text={infoMessage} />
              <br />
            </>
          )}
          {nodeCount !== null &&
            relationshipCount !== null &&
            `Displaying ${numberToUSLocale(nodeCount)} nodes, ${numberToUSLocale(relationshipCount)} relationships.`}
        </div>
      </PaneBody>
    </PaneWrapper>
  );
}
