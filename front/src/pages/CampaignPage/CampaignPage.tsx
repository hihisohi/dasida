import { useEffect, useState } from "react";
import { Link, Route } from "react-router-dom";
import styled from "styled-components";
import CampaignItem from "../../components/CampaignItems/CampaignItem";
import TagBox from "../../components/CampaignItems/TagBox";
import { ConfirmButton } from "../../components/common/Buttons";
import {
  Container,
  Container1300,
  PageTitle,
} from "../../components/common/Containers";
import { ROUTE } from "../../constant/route";
import { useRecoilValue } from "recoil";
import CampaignSlide from "../../components/CampaignItems/CampaignSlide";
import { useQuery } from "@tanstack/react-query";
import { getCampaignList } from "../../api/campaignApi";
import { GET_CAMPAIGNLIST } from "../../constant/queryKeys";
import { loggedInUserId } from "../../atoms/atoms";

export const CampaignRoot = styled(Container)`
  padding: 70px 0 0;
  max-width: 100%;
  min-height: calc(100vh - 50px);
  overflow: hidden;
`;

export const CampaingContainer = styled(Container1300)`
  padding: 100px 0;
`;

const AdditionalBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  &.guestJCT {
    justify-content: start;
  }
`;

export const CreateCampaignBtn = styled(ConfirmButton)`
  height: 50px;
  width: auto;
`;

const CampaignList = styled.div``;
export default function CampaignPage() {
  const isLogin = useRecoilValue(loggedInUserId);
  const { status, data, error } = useQuery([GET_CAMPAIGNLIST], () =>getCampaignList(isLogin));
  const [values, setValues] = useState(["모집 중", "모집 예정", "모집 마감"]);
  const [currentValue, setCurrentValue] = useState("모집 중");
  const filteredStatus =
    data && data!.filter((ele) => ele.status === currentValue);
  return (
    <CampaignRoot>
      <PageTitle>다시, 다 기부하다</PageTitle>
      <CampaignSlide />
      <CampaingContainer>
        <AdditionalBox className={isLogin === null ? "guestJCT" : ""}>
          <TagBox
            data={data}
            values={values}
            currentValue={currentValue}
            setCurrentValue={setCurrentValue}
          />
          {isLogin !== null && (
            <Link to={ROUTE.CAMPAGIN_CREATE.link}>
              <CreateCampaignBtn>새로운 캠페인 등록</CreateCampaignBtn>
            </Link>
          )}
        </AdditionalBox>
        <CampaignList>
          {data &&
            filteredStatus!.map((props, idx) => (
              <CampaignItem
                {...props}
                key={`${props.writer.nickname}` + props.campaignId}
              />
            ))}
        </CampaignList>
      </CampaingContainer>
    </CampaignRoot>
  );
}
