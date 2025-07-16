import React, { useState } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import './SwiperSection.scss';

const SwiperSection = ({ images, topImages }) => {
  const [current, setCurrent] = useState(0);

  const handleSwiperChange = (e) => {
    setCurrent(e.detail.current);
  };

  return (
    <View className='double-swiper-container'>
      <View
        className='bottom-view'
        style={{ backgroundImage: `url(${images[current]})` }}
      >
      </View>

      <Swiper
        className='top-swiper'
        current={current}
        onChange={handleSwiperChange}
        autoplay
        circular
        indicatorDots={false}
      >
        {topImages.map((src, index) => (
          <SwiperItem className='top-item' key={index}>
            <Image className='top-img' src={src} onError={() => console.log('Image load error', src)} />
          </SwiperItem>
        ))}
      </Swiper>
      {/* 自定义指示器 */}
      <View className='swiper-indicator'>
        {topImages.map((_, index) => (
          <View
            key={index}
            className={`swiper-dot ${index === current ? 'swiper-dot-active' : ''}`}
          />
        ))}
      </View>
    </View>
  );
};

export default SwiperSection;
