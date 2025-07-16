import React, {useEffect, useState} from 'react';
import './test.scss';
import {View,Image} from "@tarojs/components";
import {AtImagePicker} from "taro-ui";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/image-picker.scss";
import "taro-ui/dist/style/components/icon.scss";
import request from "../../utils/request";
import {decryptData} from "../../utils/crypto";

const test = () => {

  const [frameIndex, setFrameIndex] = useState(0);
  const [position, setPosition] = useState(0);

  // useEffect(() => {
  //   // 设置定时器，每200ms切换一帧，每20ms移动位置
  //   // const frameInterval = setInterval(() => {
  //   //   setFrameIndex((prevIndex) => (prevIndex + 1) % 10);
  //   // }, 200); // 200ms 切换一帧
  //
  //   const frameInterval = setInterval(() => {
  //     setFrameIndex((prevIndex) => (prevIndex + 1) % 3);
  //   }, 200); // 200ms 切换一帧
  //
  //   const positionInterval = setInterval(() => {
  //     setPosition((prevPosition) =>
  //       prevPosition>375? 0:prevPosition + 1); // 每20ms移动1px
  //   }, 20); // 20ms 移动一次
  //
  //   // 清理定时器
  //   return () => {
  //     clearInterval(frameInterval);
  //     clearInterval(positionInterval);
  //   };
  // }, []);


  const uploadImage = () => {
    // 选择图片
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);

        Taro.uploadFile({
          url: 'http://127.0.0.1:8080/uploadImage',
          filePath: tempFilePaths,
          name: 'image',
          header: {
            'Content-Type': 'multipart/form-data', // 设置请求的 Content-Type
            'Auth-Token': 'hz123456uio' // 设置认证令牌
          },
          success: function (uploadRes) {
            console.log('上传成功:', uploadRes.data);
            const imgaddr = "https://i.111666.best" + uploadRes.data;
            console.log('新的imgaddr:', imgaddr);
            // setAuthorimg(imgaddr);
          },
          fail: function (error) {
            console.error('上传失败:', error);
          }
        });
      }
    });
  };

  const uploadImage2 = () => {
    // 选择图片
    Taro.chooseImage({
      count: 1, // 选择的图片数量
      sizeType: ['original', 'compressed'], // 图片尺寸
      sourceType: ['album', 'camera'], // 来源
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;

        // 上传图片
        Taro.uploadFile({
          url: 'https://i.111666.best/image', // 上传文件的目标 URL
          filePath: tempFilePaths[0], // 选择的文件路径
          name: 'image', // 后端期望的字段名
          header: {
            'Content-Type': 'multipart/form-data', // 设置请求的 Content-Type
            'Auth-Token': 'hz123456uio' // 设置认证令牌
          },
          success: function (uploadRes) {
            console.log('上传成功:', uploadRes.data);

            // 处理上传成功的响应数据
            // 例如，可以更新组件状态以显示上传的图片
            setAuthorimg(uploadRes.data); // 更新图片 URL
          },
          fail: function (error) {
            console.error('上传失败:', error);
          }
        });
      }
    });
  };

  const [authorimg,setAuthorimg]=useState(
    // "https://i.111666.best/image/JjKwDwzzeFSVPZ0BZuGYx0.png"
    "https://i.111666.best/image/m9lMQ1PPNwmUlBCrcIiye4.jpg"
  );

  return (
    <View>
      <View className="sprite-container">
        {/*<View*/}
        {/*  className="sprite2"*/}
        {/*  style={{*/}
        {/*    backgroundPosition: `-${frameIndex * 50}px 0`,*/}
        {/*    transform: `translateX(${position}px)`,*/}
        {/*  }}*/}
        {/*></View>*/}

        {/*<View*/}
        {/*  className="sprite3"*/}
        {/*  style={{*/}
        {/*    backgroundPosition: `-${frameIndex * 39.3}px -80px`, // 显示第二行，假设每帧高72px*/}
        {/*    //backgroundPosition: `-${frameIndex * 39.3}px 0`,*/}
        {/*    transform: `translateX(${position}px) translateY(${position}px)`,*/}
        {/*  }}*/}
        {/*></View>*/}
        {/*<View*/}
        {/*  className="gif"*/}
        {/*  style={{*/}
        {/*    transform: `translateX(${position}px) scaleX(-1)`,*/}
        {/*  }}*/}
        {/*></View>*/}
      </View>
      <View className="images-view">
        <Image src={authorimg} className="Image-author" onClick={uploadImage}></Image>
      </View>
    </View>
  );
};

export default test;
