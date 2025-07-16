import React, {useEffect, useState} from 'react';
import {View, Text, Image, Swiper, SwiperItem, Input} from '@tarojs/components';
import { AtButton } from 'taro-ui';
import Taro from '@tarojs/taro';
import './index.scss'; // 引入样式文件
import PhotoShare from '../component/PhotoShare';

import "taro-ui/dist/style/components/button.scss"
import request from "../../utils/request"; // 按需引入
import { encryptData, decryptData } from '../../utils/crypto';

const Index = () => {
  const images = [
    'https://i.111666.best/image/VRp9bO3VSoN7ryjmrJ0dOW.jpg',
    'https://i.111666.best/image/CHBWCFQYcI3NQZkBGKD5TU.jpg',
    'https://i.111666.best/image/K0xVk5v3jBwiGxgD1v35dn.jpg',
  ];

  const [swiperCurrent, setSwiperCurrent] = useState(0); // 初始化当前swiper的索引
  const [searchValue, setSearchValue] = useState(''); // 初始化搜索框的值
  const [variableText, setVariableText] = useState('云果推荐'); // 可变变量

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleSearchAction = () => {
    //console.log("搜索内容：", searchValue);
    // 在这里添加搜索功能的逻辑
    request({
      url: `/article/allArticle2?articletitle=${searchValue}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: item.postDate,
          image: item.articleImage,
        }));
        //console.log(proItems);
        setItems(proItems);
      } else {
        Taro.showToast({
          title: '换个关键词试试',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });
  };

  useEffect(() => {
    request({
      url: `/article/allArticle?artcateid=3`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          articleCategory: item.articleCategory,
          views: item.views,
          title: item.articleTitle,
          articleText: item.articleText,
          date: item.postDate,
          image: item.articleImage,
        }));
        //console.log(proItems);
        setItems(proItems);
      } else {
        Taro.showToast({
          title: '推荐失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });
  }, []);

  const [items,setItems ]=useState([
    {
      image: 'https://i.111666.best/image/Ie267U01WooUd3Suq2UwDV.jpg',
      title: '热门果树拍'
    },
  ]);


  const handleDelete = () => {
    Taro.navigateTo({
      url: '/pages/paysuccess/paysuccess',
    });
  };
  const handleDelete2 = () => {
    Taro.navigateTo({
      url: '/pages/memberorder/memberorder',
    });
  };

  const handleinterfaceende=()=>{
    const dataToEncrypt = { name: 'hz', phone: '13600001111', sex: 'nan' };
    const str = JSON.stringify(dataToEncrypt);
    request({
      url: `/encrypt3`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
      data: { name: 'hz', phone: '13600001111', sex: 'nan' }
    }).then(res => {
      const encryptedDataFromServer = res;
      const decryptedData = JSON.parse(decryptData(encryptedDataFromServer));
      console.log('encrypt3后端加密后的数据:', res);
      console.log('encrypt3前端解密后的数据:', decryptedData);
      console.log('encrypt3前端解密后的name:', decryptedData.name);
    });

    request({
      url: `/encrypt2`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      },
      data: { name: 'hz', phone: '13600001111', sex: 'nan' }
    }).then(res => {
      const encryptedDataFromServer = res;
      const decryptedData = JSON.parse(decryptData(encryptedDataFromServer));
      console.log('encrypt2后端加密后的数据:', encryptedDataFromServer);
      console.log('encrypt2前端解密后的数据:', decryptedData);
      console.log('encrypt2前端解密后的name:', decryptedData.name);
    });

    const data = JSON.stringify({ name: 'Alice', sex: 'Female', phone: '123-456-7890' });
    const encryptedData2 = encryptData(data);
    // const encryptedData = "pSMHSR9rm5ZPCTNCRDlx0vX15qk9M14/yiKmp8NBH5ha4UVDV80P8YbXlcAYEqJJuihxCBAkxtVGjYOsUtQ6hw==";
    request({
      url: `/decrypt?encryptedData=${encryptedData2}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      const decryptedDataFromServer = res;
      console.log('decrypt前端发送的加密后的数据:', encryptedData2);
      console.log('decrypt后端解密后的数据:', decryptedDataFromServer);
      console.log('decrypt前端解密后的数据:', JSON.parse(decryptData(encryptedData2)));
    });
  }

  return (
    <View className='index'>
      <View className='viewout'>
        <Swiper
          className='lbw'
          indicatorColor='#f3e4e4'
          indicatorActiveColor='#07b912'
          vertical={false}
          circular
          indicatorDots={false} // 不使用默认指示点
          autoplay
          onChange={(e) => {
            setSwiperCurrent(e.detail.current);
          }} // 更新背景图片和当前索引
          previous-margin="55rpx"
          next-margin="55rpx"
        >
          {images.map((src, index) => (
            <SwiperItem key={index}>
              <View className='lunbo'>
                <Image className={`lbt ${index === swiperCurrent ? 'imgActive' : ''}`} src={src} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        {/* 自定义指示点 */}
        <View className="dots">
          {images.map((src, index) => (
            <View key={index} className={`dot ${index === swiperCurrent ? 'active' : ''}`}></View>
          ))}
        </View>
      </View>
      <View>
        <View className='search-container'>
          <View className='search-bar'>
            <Image className='search-icon' src={require('../../assets/tree2.jpg')} />
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Input
              className='search-input'
              type='text'
              value={searchValue}
              onInput={(e) => handleSearchChange(e.detail.value)}
              placeholder='请输入关键词查看文章'
            />
            <AtButton className='search-button' onClick={handleSearchAction}>查询</AtButton>
          </View>
        </View>
      </View>
      <View>
        <View className='variable-text-container'>
          <Text className='variable-text'>——— {variableText} ———</Text>
        </View>

        <View className='app'>
          <PhotoShare items={items} />
        </View>

        <button className="shequ" onClick={() => {
          // Taro.switchTab({
          Taro.navigateTo({
            url: '/pages/discover/find',
          });
        }}>发现</button>
        <button className="shequ" onClick={() => {
          // Taro.switchTab({
          Taro.navigateTo({
            url: '/pages/test/test',
          });
        }}>test</button>
        {/*<button className="shequ" onClick={handleDelete}>测试付款成功</button>*/}
        {/*<button className="shequ" onClick={handleinterfaceende}>测试接口加解密</button>*/}
        {/*<button className="shequ" onClick={handleDelete2}>会员订单界面</button>*/}
      </View>
    </View>
  );
}


export default Index;
