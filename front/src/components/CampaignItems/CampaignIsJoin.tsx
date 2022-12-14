import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  cancelParticipateCampaign,
  joinParticipateCampaign,
} from "../../api/campaignApi";
import CheckIconGreen from "../../assets/images/icons/icon_check_gr.png";
import CheckIconWhite from "../../assets/images/icons/icon_check_wh.png";
import { loggedInUserId } from "../../atoms/atoms";
import { GET_DETAILCAMPAIGN } from "../../constant/queryKeys";
import { ROUTE } from "../../constant/route";
import ConfirmModal from "../Modals/ConfirmModal";

const JoinCampaignBox = styled.div`
  margin-top: 10px;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70px;
    cursor: pointer;
    background: ${({ theme }) => theme.colors.dasidaGreen};
    border: 2px solid transparent;
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 18px;

    i {
      display: inline-block;
      transition: width 0.3s, height 0.3s, background-image 0.3s,
        margin-right 0.3s;
      opacity: 0;
      width: 0;
      height: 0;
      margin-right: 0;
      background: center center no-repeat;
      background-size: cover;
      background-image: url(${CheckIconWhite});
    }
    &.darkGreen {
      transition: background 0.3s, color 0.3s;
    }
    &.darkGreen:hover,
    &.darkGreen.active {
      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.dasidaGreen};
      border: 2px solid ${({ theme }) => theme.colors.dasidaGreen};
      i {
        background-image: url(${CheckIconGreen});
        opacity: 1;
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
    }
    &.bright {
      background: ${({ theme }) => theme.colors.placeholder};
    }
    &.lightGreen {
      background: ${({ theme }) => theme.colors.lightGreen};
    }
    &:disabled {
      background: ${({ theme }) => theme.colors.placeholder};
    }
  }
`;

interface JoinProps {
  isJoin: Boolean;
  campaignId: number;
  status: String;
  startDate: String;
  isSameUser: Boolean;
  isSameRate: number;
}
export default function CampaignIsJoin({
  isJoin,
  campaignId,
  status,
  startDate,
  isSameUser,
  isSameRate,
}: JoinProps) {
  const {id} = useParams();
  const [showModal, setShowModal] = useState(false);
  const {pathname} = useLocation();
  const queryClient = useQueryClient();
  const joinCampaign = useMutation(joinParticipateCampaign, {
    onSuccess: (data: any, variables, context) => {
      queryClient.invalidateQueries([GET_DETAILCAMPAIGN, id]);
    },
  });
  const cancleCampaign = useMutation(cancelParticipateCampaign, {
    onSuccess: (data: any, variables, context) => {
      queryClient.invalidateQueries([GET_DETAILCAMPAIGN, id]);
    },
  });
  const [year, month, date] = startDate.split("-");
  const isLogin = useRecoilValue(loggedInUserId);
  const fullOfCampaign = isSameRate === 0 && !isJoin;
  const handleJoinCampaign = (campaignId: number) => {
    if (!isJoin) {
      joinCampaign.mutate(campaignId);
    } else {
      cancleCampaign.mutate(campaignId);
    }
  };
  const handleClickLoginLink = () => {
    setShowModal(true);
  };
  const statusClass =
    status === "?????? ??????"
      ? "bright"
      : status === "?????? ??????"
      ? "lightGreen"
      : fullOfCampaign
      ? ""
      : "darkGreen";
  const isClickPossible =
    status === "?????? ???" && !isSameUser && isLogin !== null;
  const isGuest = isLogin === null ? "guestJoin" : "";
  return (
    <JoinCampaignBox>
      <button
        className={`${isJoin ? "active" : ""} ${statusClass} ${isGuest}`}
        onClick={() => {
          isClickPossible && handleJoinCampaign(campaignId);
          status === "?????? ???" && isLogin === null && handleClickLoginLink();
        }}
        disabled={fullOfCampaign}>
        {status === "?????? ???" ? (
          <>
            {fullOfCampaign ? (
              <>?????? ????????? ?????????..</>
            ) : isLogin === null ? (
              <>????????? ??? ?????? ???????????????</>
            ) : (
              <>
                <i></i>????????? ????????????
              </>
            )}
          </>
        ) : status === "?????? ??????" ? (
          <>
            {year}??? {month}??? {date}??? 00??? 00?????? ????????? ???????????????.
          </>
        ) : (
          <>????????? ?????????????????????.</>
        )}
      </button>
      {showModal && <ConfirmModal showModal={showModal} setShowModal={setShowModal} returnPath={pathname} />}
    </JoinCampaignBox>
  );
}
