import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createFeed, uploadFeedImages } from "../../api/feedApi";
import { getUserProfile } from "../../api/userApi";
import {
  AddImageButton,
  CloseButton,
  ClsButton,
  ConfirmButton,
} from "../../components/common/Buttons";
import AuthorInfo from "../../components/feed/AuthorInfo";

interface FormValues {
  description: string;
  tags: string;
  category: string;
}

interface ImageType {
  previewURL: string;
  imageFile: File;
}

function FeedEditForm() {
  // const { data } = useQuery(["myProfile"], getUserProfile);

  const [uploadImages, setUploadImages] = useState<ImageType[]>([]);
  const { register, handleSubmit } = useForm<FormValues>();
  const navigator = useNavigate();

  const submitMutation = useMutation(createFeed, {
    onSuccess: () => {
      navigator(-1);
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const FILES_LENGTH = files ? files.length : 0;

    if (files) {
      if (FILES_LENGTH > 8) {
        alert("8개를 이하의 이미지만 업로드 가능합니다.");
        return;
      }
      const imageList: ImageType[] = [];
      Object.keys(files).forEach((key) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[parseInt(key)]);
        const image: ImageType = {
          previewURL: "",
          imageFile: files[parseInt(key)],
        };
        reader.onload = () => {
          image.previewURL = reader.result as string;
          imageList.push(image);
          if (FILES_LENGTH - 1 === parseInt(key))
            setUploadImages((prev) => [...prev, ...imageList]);
        };
      });
    }
    e.target.value = "";
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const index = parseInt((e.target as HTMLButtonElement).value);
    uploadImages.splice(index, 1);
    setUploadImages([...uploadImages]);
  };

  const handleGoBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator(-1);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    if (uploadImages.length !== 0) {
      const { description, tags, category = "" } = data;
      const formData = new FormData();
      uploadImages.forEach(({ imageFile }) =>
        formData.append("image", imageFile)
      );
      const imageUrls = await uploadFeedImages(formData);
      submitMutation.mutate({ description, tags, imageUrls, category });
    } else alert("파일 개수 미달");
  });

  useEffect(() => {
    // console.log(uploadImages);
  }, [uploadImages]);

  return (
    <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
      <ImageFormContainer>
        <AddImageButton as="label" htmlFor="multi-upload">
          사진 추가
        </AddImageButton>
        <input
          id="multi-upload"
          type="file"
          multiple
          hidden
          onChange={handleOnChange}
        />
      </ImageFormContainer>
      <ImageFormDescription>
        최대 업로드 파일 : 8개 / 각 파일 당 파일 크기 제한 : 5MB
      </ImageFormDescription>
      <ImageAlbum>
        {uploadImages.length === 0 && (
          <ImageWarning>1개 이상의 사진을 추가해주세요</ImageWarning>
        )}
        {uploadImages.map(({ previewURL }, index) => (
          <ImageContainer key={index}>
            <ImageTest src={previewURL} alt={previewURL} key={index} />
            <ImageDelete value={index} onClick={handleDeleteClick} />
            {index === 0 && <ImageThumnailMark>썸네일</ImageThumnailMark>}
          </ImageContainer>
        ))}
      </ImageAlbum>
      <TextContainer>
        <DescriptionContainer>
          <DescriptionHeader>
            <AuthorInfo size="detail" userId={132132} />
          </DescriptionHeader>
          <DescriptionSection
            placeholder="내용 작성.."
            {...register("description", {
              required: "내용을 작성해 주세요.",
              minLength: {
                value: 4,
                message: "내용은 최소 4글자 이상이여야 합니다.",
              },
            })}></DescriptionSection>
        </DescriptionContainer>
        <DescriptionTagContainer>
          <DescriptionTag
            type="text"
            placeholder="#으로 구분하여 태그를 입력해 주세요.."
            {...register("tags", {
              required: "최소 1개 이상의 태그가 필요합니다.",
              validate: {
                tagRule: (value) =>
                  value.toString().startsWith("#") ||
                  "태그는 반드시 #으로 시작하여야합니다.",
              },
            })}
          />
        </DescriptionTagContainer>
        <DescriptionTagContainer>
          <DescriptionTag
            type="text"
            placeholder=",으로 구분하여 카테고리를 입력해 주세요.."
            {...register("category", {
              required: "최소 1개 이상의 카테고리가 필요합니다.",
            })}
          />
        </DescriptionTagContainer>
      </TextContainer>
      <ButtonContainer>
        <ClsButton onClick={handleGoBackClick}>취소</ClsButton>
        <ConfirmButton type="submit">완료</ConfirmButton>
      </ButtonContainer>
    </form>
  );
}

const ImageFormContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ImageFormDescription = styled.div`
  width: 100%;
  font-family: "Noto Sans";
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  align-items: center;
  text-align: right;
  color: #a9a9a9;
  margin: 30px 0;
`;

const ImageAlbum = styled.div`
  width: 1200px;
  height: 600px;
  background-color: #f3efe5;
  box-shadow: 5px 5px 10px rgba(231, 225, 210, 0.8);
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
`;

const ImageTest = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
`;

const ImageDelete = styled(CloseButton)`
  position: absolute;
  right: 0%;
  top: 0%;
  margin-right: 10px;
  margin-top: 10px;
`;

const ImageThumnailMark = styled.div`
  position: absolute;
  color: #ffffff;
  width: 74px;
  height: 31px;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 29px;
  margin: 14px 0px 0px 14px;
  top: 0%;
  left: 0%;
  background-color: #4279f5;
`;

const ImageWarning = styled.div`
  margin: auto;
  font-weight: 400;
  font-size: 16px;
  line-height: 36px;
  text-align: center;
  color: #a9a9a9;
`;

const TextContainer = styled.div`
  width: 1200px;
  box-shadow: 5px 5px 10px rgba(231, 225, 210, 0.8);
`;

const DescriptionContainer = styled.div`
  width: 1200px;
  padding: 40px 60px;
  background-color: #ffffff;
`;

const DescriptionHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
`;

const DescriptionSection = styled.textarea`
  margin-top: 25px;
  width: 100%;
  min-height: 131px;
  font-size: 15px;
  line-height: 36px;
  &:empty:before {
    content: "내용 작성..";
    color: #a9a9a9;
  }
  &:focus {
    outline: none;
  }
  border: 0;
`;

const DescriptionTagContainer = styled.div`
  width: 1200px;
  padding: 14px 45px 14px 45px;
  min-height: 49px;
  background-color: #004d49;
  display: flex;
  margin-bottom: 43px;
`;

const DescriptionTag = styled.input`
  color: #ffffff;
  font-size: 14px;
  line-height: 19px;
  font-weight: 600;
  width: 100%;
  text-align: left;
  margin-right: 15px;
  &:last-child {
    margin-right: 0px;
  }
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  margin: 80px 0;
  display: flex;
  justify-content: center;
`;

export default FeedEditForm;