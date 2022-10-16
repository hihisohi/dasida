import styled, { css } from 'styled-components';
import FollowToggleSmall from '../common/FollowToggleSmall';
import DefaultProfileBanner from '../../assets/images/icons/icon_profile.png';
import CertifiedBadge from '../../assets/images/icons/icon_certified.png';

interface authorInfoProps {
  size: 'simple' | 'detail';
  userId?: number;
}

function AuthorInfo({ size, userId }: authorInfoProps) {
  return (
    <Container>
      <AuthorProfile size={size} src={DefaultProfileBanner} />
      <AuthorName>{userId}</AuthorName>
      {size === 'simple' && <AuthorBadge src={CertifiedBadge} />}
      {size === 'simple' && <FollowToggleSmall />}
    </Container>
  );
}

const Container = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
`;

const AuthorProfile = styled.img<{ size: 'simple' | 'detail' }>`
  width: 36px;
  height: 36px;
  ${(props) =>
    props.size === 'simple'
      ? css`
          width: 36px;
          height: 36px;
          border-radius: 36px;
        `
      : css`
          width: 40px;
          height: 40px;
          border-radius: 40px;
        `}
  object-fit: cover;
  overflow: hidden;
`;

const AuthorName = styled.div`
  margin: 0 0 0 14px;
  font-size: 16px;
  line-height: 19px;
  color: black;
`;

const AuthorBadge = styled.img`
  margin-left: 5px;
  margin-right: 14px;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: #004d49;
  object-fit: cover;
`;

export default AuthorInfo;
